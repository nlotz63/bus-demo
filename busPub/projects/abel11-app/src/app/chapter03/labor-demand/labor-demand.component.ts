import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { transition, trigger, style, animate } from '@angular/animations';

import * as Highcharts from 'highcharts/highstock';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_annotate from 'highcharts/modules/annotations';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_data from 'highcharts/modules/export-data';
import HC_export from 'highcharts/modules/exporting'
import { PlayerComponent } from '../../player/player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgIf } from '@angular/common';

HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
    selector: 'app-labor-demand',
    templateUrl: './labor-demand.component.html',
    styleUrls: ['./labor-demand.component.scss'],
    animations: [
        trigger('myAnimationTrigger', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('400ms 30ms ease-in', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('0s', style({ opacity: 0 }))
            ])
        ])
    ],
    standalone: true,
    imports: [NgIf, BusPubLibModule, MatButtonModule, PlayerComponent]
})
export class LaborDemandComponent implements OnInit, AfterViewInit {
  @Input() mode: any = 0;
  showPlayer = false;
  chart!: Highcharts.Chart;

  //chart properties
  ldSeries: any[] = [];
  lsSeries: any[] = [];
  realSeries = [];
  eqSeries: any[] = []
  labels!: any;
  NSpoint!: any[];
  NDpoint!: any[];

  ldRef: any[] = [];
  lsRef: any[] = [];
  eqRef: any[] = [];
  //template props
  A: number = 25.99;
  K: number = 23539;
  rw: number = 79.45;
  wealth: number = 0;
  exWage: number = 0;
  pop: number = 0;
  partRate: number = 0;
  lsShift: number = 66;

  prevK = this.K;
  prevA = this.A;
  prevRw = this.rw;
  prevWealth = this.wealth;
  prevExWage = this.exWage;
  prevPop = this.pop;
  prevPartRate = this.partRate;
  xStar!: number;
  yStar!: number;


  constructor(
    private activeRoute: ActivatedRoute,
    private annoucer: LiveAnnouncer,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this.createSeries(23539, 25.99, 79.45, 0, 0, 0, 0, true);

  }

  ngAfterViewInit(): void {
    this._setupChart();
  }

  private createSeries(K: number = 23539, A: number = 25.99, rw: number = 79.45, wealth: number, exWage: number, pop: number, partRate: number, addRef: boolean) {
    this.ldSeries = [];
    this.lsSeries = [];
    this.eqSeries = [];
    let alpha = .3, x = 100,
      lsShift = 66 + wealth + exWage - pop - partRate;

    this.A = A, this.K = K, this.rw = rw, this.wealth = wealth, this.exWage = exWage, this.pop = pop, this.partRate = partRate, this.lsShift = lsShift;
    let marginalProduct = this.mode === 2 ? (x: number) => rw : (x: number) => (1 - alpha) * A * Math.pow(x, -alpha) * Math.pow(K, alpha);
    let labor = this.mode === 0 ? (x: number) => rw : (x: number) => .00045 * Math.pow(x, 2) + lsShift;
    let xstar = 0,
      ystar = 0;
    let inverseND = (x: number) => Math.pow(-(-A * Math.pow(K, alpha) + alpha * A * Math.pow(K, alpha)) / x, 1 / alpha);
    let inverseNS = (x: number) => 47.1405 * Math.sqrt(-1 * lsShift + x);

    let _findEq = (): number => {
      let lowX = 100, upX = 250, midX = (lowX + upX) / 2, epsilon = .0001;
      let i = 0

      do {
        let diff = marginalProduct(midX) - labor(midX);

        if (diff > 0) {
          lowX = midX;
          midX = (upX + midX) / 2;
        } else {
          upX = midX;
          midX = (lowX + midX) / 2;
        }
        i++;

      } while (Math.abs(marginalProduct(midX) - labor(midX)) > epsilon);
      return midX;
    }

    let lsTitle = this.mode === 0 ? 'Real wage' : 'Labor supply',
        ldTitle = this. mode === 2 ? 'Real wage' : 'Labor demand';


    do {
      let point = {
        name: ldTitle,
        x: x, y: marginalProduct(x)
      },
        point2 = {
          name: lsTitle,
          x: x, y: labor(x)
        }
      this.ldSeries.push(point);
      this.lsSeries.push(point2);
      x = x + 20;
    } while (x < 250);

    switch (this.mode) {
      case 0:
        xstar = Math.pow(rw / ((1 - alpha) * A * Math.pow(K, alpha)), -1 / alpha);
        ystar = marginalProduct(xstar);

        break;
      case 1:

        break;
      case 2:
        xstar = 47.1405 * Math.sqrt(-lsShift + rw);
        ystar = labor(xstar);
        break;
      case 4:
        xstar = _findEq();
        ystar = marginalProduct(xstar);
        this.NDpoint = [
          { x: 100, y: rw, accessibility: {enabled: false} },
          { x: inverseND(rw), y: rw, zIndex: 10, marker: { enabled: true, fillColor: 'lightgreen', symbol: 'circle', radius: 4, lineColor: 'black', lineWidth: 1 }, accessibility: {enabled: true, description: 'Quantity  of labor demanded'}},
          { x: inverseND(rw), y: 0, accessibility: { enabled: false } }
        ];
        this.NSpoint = [
          { x: 100, y: rw, accessibility: { enabled: false } },
          { x: inverseNS(rw), y: rw, zIndex: 10, marker: { enabled: true, fillColor: 'lightgreen', symbol: 'circle', radius: 4, lineColor: 'black', lineWidth: 1 }, accessibility: { enabled: true, description: 'Quantity of labor supplied'} },
          { x: inverseNS(rw), y: 0, accessibility: { enabled: false } }
        ];
        break;
      case 5:
        xstar = _findEq();
        ystar = marginalProduct(xstar);
        break;
      default:
        break;
    }
    if (this.mode === 0 || this.mode === 2) {
      this.eqSeries = [{
        name: 'Point of interest',
        x: xstar,
        y: ystar,
        zIndex: 5,
        marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'orange', lineColor: 'black', lineWidth: 1 },
        accessibility: {enabled: true, description: 'Point of interest'}
      }, { x: xstar, y: 0, accessibility: { enabled: false } }];

    } else {
      this.eqSeries = [
        { x: 100, y: ystar, accessibility: { enabled: false } },
      {
        name: 'Current equilibrium',
        x: xstar,
        y: ystar,
        zIndex: 5,
        marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'orange', lineColor: 'black', lineWidth: 1 },
        accessibility: {enabled: true, description: 'Current equilibrium'}
        },
        { x: xstar, y: 0, accessibility: { enabled: false } }
      ];
    }

    this.xStar = xstar;
    this.yStar = ystar;


    this.ldSeries.sort((a, b) => { return a.x - b.x });
    this.lsSeries.sort((a, b) => { return a.x - b.x });
    // Reference series created if addRef true
    if (addRef) {
      this.ldRef = this.ldSeries;
      this.lsRef = this.lsSeries;
      this.eqRef = this.mode === 0 || this.mode === 2 ? [
        {
          name: 'Initial point of interest',
          x: xstar,
          y: ystar,
          zIndex: 5,
          marker: { enabled: true, symbol: 'circle', radius: 3, fillColor: '#757575' }
        }, [xstar, 0]] :
        [[100, ystar],
        {
          name: 'equilibrium',
          x: xstar,
          y: ystar,
          zIndex: 5,
          marker: { enabled: true, symbol: 'circle', radius: 3, fillColor: '#757575' }
        }, [xstar, 0]];
    }

  }
  public updateChart(K: number, A: number, rw: number, wealth: number, exWage: number, pop: number, partRate: number) {
    this.createSeries(K, A, rw, wealth, exWage, pop, partRate, false);
    switch (this.mode) {
      case 0:
        this.chart.series[1].setData(this.lsSeries, true, false, false);
        this.chart.series[2].setData(this.eqSeries, true, false, false);
        break;
      case 1:
        if (this.A !== 25.99 || this.K !== 23539) this.chart.series[1].setVisible(true);
        this.chart.series[0].setData(this.ldSeries, true, false, false);
        break;
      case 2:
        this.chart.series[1].setData(this.ldSeries, true, false, false);
        this.chart.series[2].setData(this.eqSeries, true, false, false);
        break;
      case 3:
        if (this.lsShift !== 66) this.chart.series[1].setVisible(true);
        this.chart.series[0].setData(this.lsSeries, true, false, false);
        break;
      case 4:
        if (rw !== 79.45) {
          this.chart.series[3].setVisible(true)
          this.chart.series[4].setVisible(true);
        }
        this.chart.series[3].setData(this.NDpoint, true, false, false);
        this.chart.series[4].setData(this.NSpoint, true, false, false);

        break;
      case 5:
        if (this.A !== 25.99 || this.K !== 23539) this.chart.series[3].setVisible(true);
        if (this.lsShift !== 66) this.chart.series[4].setVisible(true);
        this.chart.series[0].setData(this.ldSeries, true, false, false);
        this.chart.series[1].setData(this.lsSeries, true, false, false);
        this.chart.series[2].setData(this.eqSeries, true, false, false);
        break;
      default:
        break;
    }
  }

  public playStep(value: any) {
    this.mode = value;
    this.createSeries(23539, 25.99, 79.45, 0, 0, 0, 0, true);
    this._setupChart();
    this.annoucer.announce(`Step ${this.mode + 1} has loaded.`);

  }

  public reset() {
    this._setupChart();
    this.updateChart(23539, 25.99, 79.45, 0, 0, 0, 0);
    this.annoucer.announce('The interactive has been reset');
  }

  private _setupChart() {
    const chart1 = this.el.nativeElement.querySelector('#container');
    this.chart = new Highcharts.Chart(chart1, {
      chart: {
        type: 'spline',
        animation: false,
        height: 540,

      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Labor Market' },
      legend: { enabled: false },
      accessibility: {
        point: {
          valueDescriptionFormat: `Labor equals {point.x:.0f} million. Real wage equals {point.y:.2f}.`
        }
      },
      series: [

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        min: 100,
        max: 300,
        title: { text: 'Labor, N (millions of workers)' }

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        min: 70,
        max: 100,
        title: { text: 'Real wage' }

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          lineWidth: 2,
          color: '#C31229',
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2
          },
          tooltip: {
            valueDecimals: 2,
            pointFormat: `Quantity: {point.x} million<br/>Real wage: {point.y}`
          }
        }

      }

    });

    switch (this.mode) {
      case 0:
        this.chart.addSeries({
          type: 'spline',
          name: 'MPN curve and<br/>Labor demand curve, ND',
          zIndex: 0,
          animation: false,
          data: this.ldSeries,
          accessibility: {
            description: 'A slightly convex downward-sloping curve. Intersects the real wage curve.'
          }
        },
        );
        this.chart.addSeries({
          type: 'spline',
          name: 'Real wage',
          zIndex: 0,
          animation: false,
          data: this.lsSeries,
          accessibility: {
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }

        }
        );
        this.chart.addSeries({
          type: 'line',
          name: '',
          animation: false,
          enableMouseTracking: true,
          dashStyle: 'ShortDot',
          color: '#757575',
          zIndex: 2,
          data: this.eqSeries,
          tooltip: {
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor demanded: {point.x:.0f}, real wage: {point.y:.2f}'

            }
          },
        });

        // Reference series
        this.chart.addSeries({
          type: 'spline',
          name: '',
          zIndex: -1,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.lsRef,
          accessibility: {
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }

        }
        );
        this.chart.addSeries({
          type: 'line',
          name: '',
          animation: false,
          enableMouseTracking: true,
          dashStyle: 'ShortDot',
          color: '#757575',
          zIndex: 1,
          data: this.eqRef,
          tooltip: {
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          marker: { fillColor: '#757575', radius: 4 },
          accessibility: {
            point: {
              valueDescriptionFormat: 'Initial point. labor demanded: {point.x:.0f} million workers, real wage: {point.y:.2f}',
            }
          },
        });

        this.chart.update({
          yAxis: {
            title: {
              useHTML: true,
              text: `Marginal product of labor, MPN</br>Real wage (goods per unit of labor)`
            }
          }


        }, true);

        break;
      case 1:
        this.chart.addSeries({
          type: 'spline',
          name: 'ND',
          zIndex: 2,
          animation: false,
          data: this.ldSeries
        });
        // Reference series
        this.chart.addSeries({
          type: 'spline',
          name: '',
          zIndex: -1,
          visible: false,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.ldRef,
          accessibility: {
            description: 'The initial labor demand curve.'
          }

        }
        );

        break;
      case 2:
        this.chart.addSeries({
          type: 'spline',
          name: 'Labor supply curve, NS',
          zIndex: 0,
          animation: false,
          data: this.lsSeries,
          accessibility: {
            description: 'An upward sloping curve that is slightly convex upward. '
          }

        }
        );
        this.chart.addSeries({
          type: 'spline',
          name: 'Real wage',
          zIndex: 0,
          animation: false,
          data: this.ldSeries,
          accessibility: {
            description: 'A horizontal line at the current real wage.'
          }

        }
        );
        this.chart.addSeries({
          type: 'line',
          name: '',
          animation: false,
          enableMouseTracking: true,
          dashStyle: 'ShortDot',
          color: '#757575',
          zIndex: 2,
          data: this.eqSeries,
          tooltip: {
            pointFormat: 'Labor supplied: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor supplied: {point.x:.0f}, real wage: {point.y:.2f}'

            }
          },
        });


        // Reference series
        this.chart.addSeries({
          type: 'spline',
          name: '',
          zIndex: -1,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.ldRef,
          accessibility: {
            description: 'A horizontal line at the initial real wage. It intersects the initial labor supply curve. '
          }

        }
        );
        this.chart.addSeries({
          type: 'line',
          name: '',
          animation: false,
          enableMouseTracking: true,
          dashStyle: 'ShortDot',
          lineWidth: 1,
          color: '#757575',
          zIndex: 1,
          data: this.eqRef,
          tooltip: {
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          marker: { fillColor: '#757575', radius: 4,  },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor demanded: {point.x:.0f} million workers, real wage: {point.y:.2f}'

            }
          },
        });

        break;
      case 3:
        this.chart.addSeries({
          type: 'spline',
          name: 'NS',
          zIndex: 2,
          animation: false,
          data: this.lsSeries,
          label: {
            enabled: true
          }
        });
        // Reference series
        this.chart.addSeries({
          type: 'spline',
          name: 'Initial labor supply',
          zIndex: -1,
          visible: false,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.lsRef,
          label: {
            enabled: false
          },
          accessibility: {
            description: 'An upward-sloping, slightly convex, curve.'
          }

        }
        );
        break;
      case 4:
        this.chart.addSeries({
          type: 'spline',
          name: 'ND',
          zIndex: 2,
          animation: false,
          data: this.ldSeries,
          accessibility: {
            description: `A downward sloping and slightly convex curve.`
          }
        });
        this.chart.addSeries({
          type: 'spline',
          name: 'NS',
          zIndex: 2,
          animation: false,
          data: this.lsSeries,
          accessibility: {
            description: `An upward sloping and slightly convex curve.`
          }

        });
        this.chart.addSeries({
          type: 'line',
          dashStyle: 'ShortDot',
          color: '#757575',
          enableMouseTracking: true,
          name: '',
          zIndex: 2,
          animation: false,
          data: this.eqSeries,
          tooltip: {
            headerFormat: '<b>Market Equilibrium</b><br/>',
            pointFormat: 'Quantity demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          }
        });
        this.chart.addSeries({
          type: 'line',
          dashStyle: 'ShortDot',
          visible: false,
          color: '#757575',
          enableMouseTracking: true,
          name: '',
          zIndex: 2,
          animation: false,
          data: this.NDpoint,
          tooltip: {
            headerFormat: '',
            pointFormat: 'Quantity demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          }
        });
        this.chart.addSeries({
          type: 'line',
          dashStyle: 'ShortDot',
          visible: false,
          color: '#757575',
          enableMouseTracking: true,
          name: '',
          zIndex: 2,
          animation: false,
          data: this.NSpoint,
          tooltip: {
            headerFormat: '',
            pointFormat: 'Quantity supplied: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          }
        });

        break;
      case 5:
        this.chart.addSeries({
          type: 'spline',
          name: 'ND',
          zIndex: 2,
          animation: false,
          data: this.ldSeries
        });
        this.chart.addSeries({
          type: 'spline',
          name: 'NS',
          zIndex: 2,
          animation: false,
          data: this.lsSeries
        });
        this.chart.addSeries({
          type: 'line',
          dashStyle: 'ShortDot',
          enableMouseTracking: true,
          color: '#757575',
          name: '',
          zIndex: 3,
          animation: false,
          data: this.eqSeries,
          tooltip: {
            headerFormat: '<b>Current Equilibrium</b><br/>',
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },

        });
        // Reference series
        this.chart.addSeries({
          type: 'spline',
          name: '',
          zIndex: -1,
          visible: false,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.ldRef,
          accessibility: {
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }
        }
        );
        this.chart.addSeries({
          type: 'spline',
          name: '',
          zIndex: -1,
          visible: false,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#757575',
          animation: false,
          data: this.lsRef,
          accessibility: {
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }
        }
        );
        this.chart.addSeries({
          type: 'line',
          name: '',
          animation: false,
          enableMouseTracking: true,
          dashStyle: 'ShortDot',
          color: '#757575',
          zIndex: 2,
          data: this.eqRef,
          tooltip: {
            headerFormat: '<b>Initial Equilibrium</b><br/>',
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          marker: { fillColor: '#757575' },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor demanded: {point.x}, real wage: {point.y}'

            }
          },
        });
        break;

      default:
        break;
    }

  }
  public messageBuilder(slider: string, value: any) {
    let message: string = ``;
    console.log(this.prevA, value);

    switch (this.mode) {
      case 0:
        if (this.prevRw <= this.rw) {
          message = `The horizontal line showing the real wage shifted up. The point of intersection with the labor demand curve moves up along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        } else {
          message = `The horizontal line showing the real wage shifted down. The point of intersection with the labor demand curve moves down along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        }
        this.prevRw = this.rw;
        break;
      case 1:
        if (this.prevA <= this.A && slider === 'prod') {
          message = `A beneficial supply shock shifted the labor demand curve to the right.`;
          this.prevA = this.A;
        } else if (this.prevA > this.A && slider === 'prod') {
          message = `An adverse supply shock shifted the labor demand curve to the left.`;
          this.prevA = this.A;
        } else if (this.prevK <= this.K && slider === 'capital') {
          message = `An increase in capital shifted the labor demand curve to the right.`;
          this.prevK = this.K;
        } else {
          message = `An decrease in capital shifted the labor demand curve to the left.`;
          this.prevK = this.K;
        }
        break;
      case 2:
        if (this.prevRw <= this.rw) {
          message = `The horizontal line showing the real wage shifted up. The point of intersection with the labor supply curve moves up along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        } else {
          message = `The horizontal line showing the real wage shifted down. The point of intersection with the labor supply curve moves down along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        }
        this.prevRw = this.rw;
        break;
      case 3:
        if (this.prevWealth <= this.wealth && slider === 'wealth') {
          message = `An increase in wealth shifted the labor supply curve to the left.`;
          this.prevWealth = this.wealth;
        } else if (this.prevWealth > this.wealth && slider === 'wealth') {
          message = `A decrease in wealth shifted the labor supply curve to the right.`;
          this.prevWealth = this.wealth;
        } else if (this.prevExWage <= this.exWage && slider === 'exRw') {
          message = `An increase in the expected real wage shifted the labor supply curve to the left.`;
          this.prevExWage = this.exWage;
        } else if (this.prevExWage > this.exWage && slider === 'exRw') {
          message = `A decrease in the expected real wage shifted the labor supply curve to the right.`;
          this.prevExWage = this.exWage;
        } else if (this.prevPop <= this.pop && slider === 'pop') {
          message = ` An increase in the working age population shifted the labor supply curve to the right.`;
          this.prevPop = this.pop;
        } else if (this.prevPop > this.pop && slider === 'pop') {
          message = `A decrease in the expected real wage shifted the labor supply curve to the left.`;
          this.prevPop = this.pop;
        } else if (this.prevPartRate <= this.partRate && slider === 'partRate') {
          message = ` An increase in the participation rate shifted the labor supply curve to the right.`;
          this.prevPartRate = this.partRate;
        } else {
          message = `A decrease in the participation rate shifted the labor supply curve to the left.`;
          this.prevPartRate = this.partRate;
        }
        break;
      case 4:
        if (this.rw < 79.45) {
          message = `The quantity of labor demanded is greater than the quantity of labor supplied. The market is not in equilibrium.`;
        } else if (this.rw > 79.45) {
          message = `The quantity of labor demanded is less than the quantity of labor supplied. The market is not in equilibrium.`;

        } else {
          message = `The quantity of labor demanded is equal to the quantity of labor supplied. The market is in equilibrium.`;
        }
        this.prevRw = this.rw;
        break;
      case 5:
        if (this.prevA <= this.A && slider === 'prod') {
          message = `A beneficial supply shock shifted the labor demand curve to the right, increasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevA = this.A;
        } else if (this.prevA > this.A && slider === 'prod') {
          message = `An adverse supply shock shifted the labor demand curve to the left, decreasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevA = this.A;
        } else if (this.prevWealth <= this.wealth && slider === 'wealth') {
          message = `An increase in wealth shifted the labor supply curve to the left, decreasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and increasing the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevWealth = this.wealth;
        } else {
          message = `A decrease in wealth shifted the labor supply curve to the right, increasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and decreasing the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevWealth = this.wealth;
        }
        break;
      default:
        break;
    }

    this.annoucer.announce(message);
  }
}
