import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_annotate from 'highcharts/modules/annotations';
import HC_seriesLabel from 'highcharts/modules/series-label';

HC_accessibility(Highcharts);
HC_annotate(Highcharts);
HC_seriesLabel(Highcharts);

@Component({
  selector: 'app-labor-demand',
  templateUrl: './labor-demand.component.html',
  styleUrls: ['./labor-demand.component.scss']
})
export class LaborDemandComponent implements OnInit, AfterViewInit {
  @Input() mode = 1;
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
    private annoucer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
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

    do {
      let point = {
        x: x, y: marginalProduct(x)
      },
        point2 = {
          x: x, y: labor(x)
        }
      this.ldSeries.push(point);
      this.lsSeries.push(point2);
      x = x + 1;
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
          [100, rw],
          { x: inverseND(rw), y: rw, zIndex: 10, color: 'green', marker: { enabled: true, symbol: 'circle', radius: 4 } },
          [inverseND(rw), 0]
        ];
        this.NSpoint = [
          [100, rw],
          { x: inverseNS(rw), y: rw, zIndex: 10, color: 'green', marker: { enabled: true, symbol: 'circle', radius: 4 } },
          [inverseNS(rw), 0]
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
        name: 'Current equilibrium',
        x: xstar,
        y: ystar,
        zIndex: 5,
        marker: { enabled: true, symbol: 'circle', r: 4, fillColor: '#3096DF' }
      }, [xstar, 0]];

    } else {
      this.eqSeries = [[100, ystar],
      {
        name: 'Current equilibrium',
        x: xstar,
        y: ystar,
        zIndex: 5,
        marker: { enabled: true, symbol: 'circle', r: 4, fillColor: '#3096DF' }
      }, [xstar, 0]];
    }

    this.xStar = xstar;
    this.yStar = ystar;


    this.ldSeries.sort((a, b) => { return a.x - b.x });
    this.lsSeries.sort((a, b) => { return a.x - b.x });
    // Reference series created if addRef true
    if (addRef) {
      this.ldRef = this.ldSeries;
      this.lsRef = this.lsSeries;
      this.eqRef = this.mode === 0 ? [
        {
          name: 'equilibrium',
          x: xstar,
          y: ystar,
          zIndex: 5,
          marker: { enabled: true, symbol: 'circle', r: 3, fillColor: '#757575' }
        }, [xstar, 0]] :
        [[100, ystar],
        {
          name: 'equilibrium',
          x: xstar,
          y: ystar,
          zIndex: 5,
          marker: { enabled: true, symbol: 'circle', r: 3, fillColor: '#757575' }
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

  public reset() {
    this.chart.destroy();
    this._setupChart();
    this.updateChart(23539, 25.99, 79.45, 0, 0, 0, 0);
  }

  private _setupChart() {
    this.chart = new Highcharts.Chart('container', {
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
          enableMouseTracking: false,
          color: '#C31229'
        }

      }

    });

    switch (this.mode) {
      case 0:
        this.chart.addSeries({
          type: 'spline',
          name: 'MPN curve and<br/>Labor demand curve, ND',
          zIndex: 1,
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
          zIndex: 3,
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
          zIndex: 4,
          data: this.eqSeries,
          tooltip: {
            headerFormat: '<b>Current Equilibrium</b><br/>',
            pointFormat: 'Labor demanded: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor demanded: {point.x}, real wage: {point.y}'

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
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }

        }
        );

        break;
      case 2:
        this.chart.addSeries({
          type: 'spline',
          name: 'Labor supply curve, NS',
          zIndex: 3,
          animation: false,
          data: this.lsSeries,
          accessibility: {
            description: 'A horizontal line at the current real wage. It intersects the M P N curve. '
          }

        }
        );
        this.chart.addSeries({
          type: 'spline',
          name: 'Real wage',
          zIndex: 3,
          animation: false,
          data: this.ldSeries,
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
          zIndex: 4,
          data: this.eqSeries,
          tooltip: {
            headerFormat: '<b>Current Equilibrium</b><br/>',
            pointFormat: 'Labor supplied: {point.x:.0f} million workers<br/>Real wage: {point.y:.2f}'
          },
          accessibility: {
            point: {
              valueDescriptionFormat: '{point.name} labor supplied: {point.x}, real wage: {point.y}'

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
          zIndex: 2,
          data: this.eqRef,
          tooltip: {
            headerFormat: 'Initial Equilibrium<br/>',
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
      case 3:
        this.chart.addSeries({
          type: 'spline',
          name: 'NS<sup>1</sup>',
          zIndex: 2,
          animation: false,
          data: this.lsSeries
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
          data: this.lsRef,
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
  public messageBuilder(slider: string, value: number) {
    let message: string = ``;
    switch (this.mode) {
      case 0:
        if (this.prevRw <= value) {
          message = `The horizontal line showing the real wage shifted up. The point of intersection with the labor demand curve moves up along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        } else {
          message = `The horizontal line showing the real wage shifted down. The point of intersection with the labor demand curve moves down along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        }
        this.prevRw = value;
        break;
      case 1:
        if (this.prevA <= value && slider === 'prod') {
          message = `A beneficial supply shock shifted the labor demand curve to the right.`;
          this.prevA = value;
        } else if (this.prevA > value && slider === 'prod') {
          message = `An adverse supply shock shifted the labor demand curve to the left.`;
          this.prevA = value;
        } else if (this.prevK <= value && slider === 'capital') {
          message = `An increase in capital shifted the labor demand curve to the right.`;
          this.prevK = value;
        } else {
          message = `An decrease in capital shifted the labor demand curve to the left.`;
          this.prevK = value;
        }
        break;
      case 2:
        if (this.prevRw <= value) {
          message = `The horizontal line showing the real wage shifted up. The point of intersection with the labor supply curve moves up along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        } else {
          message = `The horizontal line showing the real wage shifted down. The point of intersection with the labor supply curve moves down along the curve and occurs at ${this.xStar.toFixed(1)} million workers and a real wage of ${this.yStar.toFixed(1)}.`;
        }
        this.prevRw = value;
        break;
      case 3:
        if (this.prevWealth <= value && slider === 'wealth') {
          message = `An increase in wealth shifted the labor supply curve to the left.`;
          this.prevWealth = value;
        } else if (this.prevWealth > value && slider === 'wealth') {
          message = `A decrease in wealth shifted the labor supply curve to the right.`;
          this.prevWealth = value;
        } else if (this.prevExWage <= value && slider === 'exRw') {
          message = `An increase in the expected real wage shifted the labor supply curve to the left.`;
          this.prevExWage = value;
        } else if (this.prevExWage > value && slider === 'exRw') {
          message = `A decrease in the expected real wage shifted the labor supply curve to the right.`;
          this.prevExWage = value;
        } else if (this.prevPop <= value && slider === 'pop') {
          message = ` An increase in the working age population shifted the labor supply curve to the right.`;
          this.prevPop = value;
        } else if (this.prevPop > value && slider === 'pop') {
          message = `A decrease in the expected real wage shifted the labor supply curve to the left.`;
          this.prevPop = value;
        } else if (this.prevPartRate <= value && slider === 'partRate') {
          message = ` An increase in the participation rate shifted the labor supply curve to the right.`;
          this.prevPartRate = value;
        } else {
          message = `A decrease in the participation rate shifted the labor supply curve to the left.`;
          this.prevPartRate = value;
        }
        break;
      case 4:
        if (value < 79.45) {
          message = `The quantity of labor demanded is greater than the quantity of labor supplied. The market is not in equilibrium.`;
        } else if (value > 79.45) {
          message = `The quantity of labor demanded is less than the quantity of labor supplied. The market is not in equilibrium.`;

        } else {
          message = `The quantity of labor demanded is equal to the quantity of labor supplied. The market is in equilibrium.`;
        }
        this.prevRw = value;
        break;
      case 5:
        if (this.prevA <= value && slider === 'prod') {
          message = `A beneficial supply shock shifted the labor demand curve to the right, increasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevA = value;
        } else if (this.prevA > value && slider === 'prod') {
          message = `An adverse supply shock shifted the labor demand curve to the left, decreasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevA = value;
        } else if (this.prevWealth <= value && slider === 'wealth') {
          message = `An increase in wealth shifted the labor supply curve to the left, decreasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and increasing the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevWealth = value;
        } else {
          message = `A decrease in wealth shifted the labor supply curve to the right, increasing the equilibrium quantity of labor to ${this.xStar.toFixed(1)} million workers and decreasing the equilibrium real wage to ${this.yStar.toFixed(1)}.`;
          this.prevWealth = value;
        }
        break;
      default:
        break;
    }

    this.annoucer.announce(message);
  }
}
