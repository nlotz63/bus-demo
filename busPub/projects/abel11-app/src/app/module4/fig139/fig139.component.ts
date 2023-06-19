import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';
import { interval } from 'rxjs';

import * as Highcharts from 'highcharts';
import HC_annotate from 'highcharts/modules/annotations';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { PlayerComponent } from '../../player/player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

HC_export(Highcharts);
HC_annotate(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
    selector: 'app-fig139',
    templateUrl: './fig139.component.html',
    styleUrls: ['./fig139.component.scss'],
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
    imports: [
        NgIf,
        MatButtonModule,
        PlayerComponent,
    ],
})

export class Fig139Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;
  chart!: Highcharts.Chart;
  chart2!: Highcharts.Chart;

  buttonTitle: string = 'Play';
  subscription!: any;
  phase1: boolean = false;
  phase2: boolean = false;
  eqLabel: string = 'Long-run';

  params = {
    Y: 4320.051344510579,
    Yf: 3216,
    rf: 1.530134879723534,
    nx0: 50,
    r: 1.4359281217617639,
  }

  slider = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(100),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(3558),
    effTax: new FormControl(0.12),

    money: new FormControl(255000),
    priceLevel: new FormControl(105.5),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)
  });

  sliderF = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(100),
    govPurchases: new FormControl(300),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(3450),
    effTax: new FormControl(0.12),

    money: new FormControl(200000),
    priceLevel: new FormControl(110),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)
  });

  playInterval = interval(300);

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private el: ElementRef) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this._createSeries(false);
    this._createSeriesF(false);

  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);
  }

  //public methods

  public playStep(value: number) {
    this.mode = value;
    this.params = {
      Y: 4320.051344510579,
      Yf: 3216,
      rf: 1.530134879723534,
      nx0: 50,
      r: 1.4359281217617639,
    }
    this._setupChart(true);

  }

  public playSimulation() {
    if (this.buttonTitle === 'Play') {
      this.announcer.announce('The simulation has started', 'assertive');
      const animate = interval(300);
      this.phase1 = true;
      let govtPurch = this.slider.value.govPurchases!;
      let priceD = this.slider.value.priceLevel!, priceF = this.sliderF.value.priceLevel!;
      this.eqLabel = 'Short-run';
      this.subscription = animate.subscribe((x) => {
        if (govtPurch <= 1500) {
          govtPurch = govtPurch + 30;
          this.updateChart({ govPurchases: govtPurch }, 1);
        } else {
          this.phase2 = true;
        }
        if (x > 38 && priceD <= 130) {
          priceD = priceD + .5;
          priceF = priceF + .297;
          if(priceD > 129.5) this.eqLabel = 'Long-run';

          this.updateChart({ priceLevel: priceD }, 1);
          this.updateChart({ priceLevel: priceF }, 2);
        }
        if (x > 100) {
          this.subscription.unsubscribe();
          this.announcer.announce('The simulation has ended.');

        }
      });
    } else if (this.buttonTitle === 'Reset') {
      this.subscription.unsubscribe();
      this.phase1 = false;
      this.phase2 = false;
      this.slider.patchValue({ govPurchases: 600, priceLevel: 105.5 });
      this.sliderF.patchValue({ priceLevel: 110 });
      this.playStep(0);
      this.buttonTitle = 'Play';
      this.eqLabel = 'Long-run';
      this.announcer.announce('The simulation has been reset');
      return;
    }
    this.buttonTitle = 'Reset';
  }

  public updateChart(value: any, model: number) {
    if (model === 1) this.slider.patchValue(value);
    if (model === 2) this.sliderF.patchValue(value);

    let series = this._createSeries(false);
    let seriesF = this._createSeriesF(false);

    this.chart.series[0].setData(series.IS, false, false, false);
    this.chart.series[1].setData(series.LM, false, false, false);
    this.chart.series[2].setData(series.FE, false, false, false);
    this.chart.series[3].setData(series.EQ, true, false, false);

    this.chart2.series[0].setData(seriesF.IS, false, false, false);
    this.chart2.series[1].setData(seriesF.LM, false, false, false);
    this.chart2.series[2].setData(seriesF.FE, false, false, false);
    this.chart2.series[3].setData(seriesF.EQ, true, false, false);

    this.chart.update({
      annotations: [
        {
          labelOptions: {
            backgroundColor: 'white',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: -5
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: 3700,
                y: -3
              },
              formatter: (): any => {
                return `${this.eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`;
              },
              accessibility: {
                description: `${this.eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`
              }
            }
          ]
        }
      ]
    });
    this.chart2.update({
      annotations: [
        {
          labelOptions: {
            backgroundColor: 'white',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: -5
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: 2700,
                y: -2
              },
              formatter: (): any => {
                return `${this.eqLabel}:</br>Y<sub>For</sub> = $${seriesF.EQ[1].x.toFixed(0)}</br>r<sub>For</sub> = ${seriesF.EQ[0].y.toPrecision(2)}%`;
              },
              accessibility: {
                description: `${this.eqLabel}:</br>Y subscript foreign = $${seriesF.EQ[1].x.toFixed(0)}</br>r subscript foreign = ${seriesF.EQ[0].y.toPrecision(2)}%`
              }
            }
          ]
        }
      ]
    });
  }

  // private methods

  private _setupChart(addRef: boolean) {
    let series = this._createSeries(addRef);
    let seriesF = this._createSeriesF(addRef);
    const chart1 = this.el.nativeElement.querySelector('#chart1');
    const chart2 = this.el.nativeElement.querySelector('#chart2');

    this.chart = new Highcharts.Chart(chart1, {
      chart: {
        type: 'line',
        animation: false,
        height: 350,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'ISLM (Home)' },
      legend: { enabled: false },
      tooltip: { enabled: true },
      accessibility: {
        point: {
          valueDescriptionFormat: `domestic output equals {point.x:.0f} billion dollars. Domestic real interest rate equals {point.y:.2f} percent.`
        }
      },
      series: [
        {
          type: 'line',
          name: 'IS curve',
          zIndex: 1,
          lineWidth: 2,
          animation: false,
          data: series.IS,
          accessibility: {
            description: `A downward sloping straight line.`
          },
          label: {
            useHTML: true,
            format: `IS`,
          }
        },
        {
          type: 'line',
          name: 'LM',
          zIndex: 1,
          lineWidth: 2,
          animation: false,
          data: series.LM,
          accessibility: {
            description: `An upward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'FE',
          color: 'black',
          zIndex: 0,
          lineWidth: 2,
          animation: false,
          data: series.FE,
          accessibility: {
            description: `A vertical line.`
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: true,
          animation: false,
          data: series.EQ,
          label: {
            enabled: false
          },
        },
        {
          type: 'line',
          name: 'Initial IS',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: series.isRef,
        },
        {
          type: 'line',
          name: 'Initial LM',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: series.lmRef,
        },
        {
          type: 'line',
          name: 'Initial FE',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: series.feRef,
        },
        {
          type: 'line',
          name: 'Initial equilibrium',
          color: 'rgba(93, 93, 93, 1)',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 1,
          allowPointSelect: false,
          animation: false,
          data: series.eqRef,
          label: { enabled: false }

        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 1000,
        max: 7000

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Real interest rate, r' },
        tickInterval: 1,
        min: -3,
        max: 5

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Output, Y: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          marker: { enabled: false, radius: 2, symbol: 'circle' },
          label: {
            style: {
              fontWeight: '400'
            }
          }
        }

      },
      annotations: [
        {
          labelOptions: {
            backgroundColor: 'white',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: -5
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: 3700,
                y: -3
              },
              formatter: (): any => {
                return `${this.eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`;
              },
              accessibility: {
                description: `${this.eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`
              }
            }
          ]
        }
      ]
    });

    this.chart2 = new Highcharts.Chart(chart2, {
      chart: {
        type: 'spline',
        animation: false,
        height: 350,
        borderRadius: 5,
        styledMode: false
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'ISLM (Foreign)' },
      legend: { enabled: false },
      tooltip: { useHTML: true, enabled: true },
      accessibility: {
        point: {
          valueDescriptionFormat: `Foreign output equals {point.x:.0f} billion dollars. Foreign real interest rate equals {point.y:.2f} percent.`
        }
      },

      series: [
        {
          type: 'line',
          name: 'IS<sub>For</sub>',
          zIndex: 1,
          lineWidth: 2,
          animation: false,
          data: seriesF.IS,
          accessibility: {
            description: `A downward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'LM<sub>For</sub>',
          zIndex: 1,
          lineWidth: 2,
          animation: false,
          data: seriesF.LM,
          accessibility: {
            description: `An upward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'FE<sub>For</sub>',
          color: 'black',
          zIndex: 0,
          lineWidth: 2,
          animation: false,
          data: seriesF.FE,
          accessibility: {
            description: `A vertical line.`
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: true,
          animation: false,
          data: seriesF.EQ,
          label: {
            enabled: false
          },
          accessibility: {
            description: `${this.eqLabel}:</br>Y subscript foreign = $${seriesF.EQ[1].x.toFixed(0)} billion dollars.</br>r subscript foreign = ${seriesF.EQ[0].y.toPrecision(2)} percent.`
          }
        },
        {
          type: 'line',
          name: 'Initial IS<sub>For</sub>',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { useHTML: true, enabled: false },
          visible: true,
          animation: false,
          data: seriesF.isRef,
        },
        {
          type: 'line',
          name: 'Initial LM',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: seriesF.lmRef,
        },
        {
          type: 'line',
          name: 'Initial FE',
          dashStyle: 'LongDash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: seriesF.feRef,
        },
        {
          type: 'line',
          name: 'Initial equilibrium',
          color: 'rgba(93, 93, 93, 1)',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 1,
          allowPointSelect: false,
          animation: false,
          data: seriesF.eqRef,
          label: { enabled: false }

        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 1000,
        max: 6000

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Foreign real interest rate, r<sub>For</sub>' },
        tickInterval: 1,
        min: -2,
        max: 5

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Output, Y: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          marker: { enabled: false, radius: 2, symbol: 'circle' },
          label: {
            useHTML: true,
            style: {
              fontWeight: '400'
            }
          }
        }
      },
      annotations: [
        {
          labelOptions: {
            backgroundColor: 'white',
            borderWidth: 0,
            verticalAlign: 'bottom',
            y: -5,
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: 2700,
                y: -2
              },
              useHTML: true,
              style: {
                fontSize: '11.2px'
              },
              formatter: (): any => {
                return `${this.eqLabel}:</br>Y<sub>For</sub> = $${seriesF.EQ[1].x.toFixed(0)}</br>r<sub>For</sub> = ${seriesF.EQ[0].y.toPrecision(2)}%`;
              },
              accessibility: {
                description: `${this.eqLabel}:</br>Y subscript Foreign = $${seriesF.EQ[1].x.toFixed(0)}</br>r subscript foreign = ${seriesF.EQ[0].y.toPrecision(2)}%`
              }
            }
          ]
        }
      ]
    });

  }

  private _createSeries(addRef: boolean) {
    // slider values
    let slider = this.slider.value;
    let params = this.params;
    // model parameters
    let c0: number = slider.expectedOutput! + slider.wealth!, cy: number = .6, cr: number = 300, t0: number = 0.5 * slider.taxes!, t: number = 0.2,
      i0: number = slider.expectedTFP! * (1 - 4 * slider.effTax!), ir: number = 200, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = 4140.051344510579 + slider.capitalStock! + slider.supplyShock! + slider.laborSupply! + .3 * slider.govPurchases!;

    let x: number = 1000, isSeries = [], lmSeries = [], eqSeries = [], feSeries;
    let isRef: any[] = [], lmRef: any[] = [], eqRef: any[] = [], feRef: any[] = [];

    // NX curve and parameters
    let nx0 = 50, nxy = .15, nxyf = 0.25, nxr = 250, nxrf = 400;
    let NXcurve = (x: number) => {
      return params.nx0 - nxy * params.Y + nxyf * params.Yf - nxr * x + nxrf * params.rf;
    }
    let inverseNX = (x: number) => {
      return (-x + params.nx0 + nxrf * params.rf - nxy * params.Y + nxyf * params.Yf) / nxr;
    }


    let is = (x: number) => {
      return (c0 + G + i0 - cy * t0 - x + cy * x - nxy * x - cy * t * x + params.nx0 +
        nxrf * params.rf + nxyf * params.Yf) / (cr + ir + nxr);
    }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let eq = (-(l0 / lr) + c0 / (cr + ir + nxr) + G / (cr + ir + nxr) + i0 / (cr + ir + nxr) + M / (lr * P) + piE - (cy * t0) / (cr + ir + nxr) + params.nx0 / (cr + ir + nxr) + (nxrf * params.rf) / (cr + ir + nxr) + (nxyf * params.Yf) / (cr + ir + nxr)) / (ly / lr + 1 / (cr + ir + nxr) - cy / (cr + ir + nxr) + nxy / (cr + ir + nxr) + (cy * t) / (cr + ir + nxr));

    do {
      let point = {
        name: 'IS',
        x: x,
        y: is(x)
      };
      let point2 = {
        name: 'LM',
        x: x,
        y: lm(x)
      }

      isSeries.push(point);
      lmSeries.push(point2);
      x = x + 1500;
    } while (x <= 7000);

    // equilibrium series
    eqSeries = [
      { x: 0, y: is(eq), marker: { enabled: false, radius: 0 }, accessibility: {enabled: false} },
      {
        name: 'Equilibrium',
        x: eq,
        y: is(eq),
        color: 'blue',
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        },
        accessibility: {
          enabled: true
        }
      },
      { x: eq, y: -4, marker: { enabled: false }, accessibility: {enabled: false} }
    ];
    feSeries = [
      { x: ybar, y: -3, marker: { enabled: false, radius: .5 } },
      { x: ybar, y: 5, marker: { enabled: false, radius: .5 } },
    ];

    if (addRef) {
      isRef = isSeries;
      lmRef = lmSeries;
      eqRef = [
        { x: 0, y: is(eq), marker: { enabled: false, radius: 0 } },
        {
          name: 'Initial equilibrium',
          x: eq,
          y: is(eq),
          color: 'rgba(93, 93, 93, 1)',
          marker: {
            symbol: 'circle',
            enabled: true,
            radius: 3
          }
        },
      ];
      feRef = feSeries;
    }

    this.params.r = eqSeries[1].y;
    this.params.Y = eqSeries[1].x;

    return {
      IS: isSeries,
      LM: lmSeries,
      EQ: eqSeries,
      FE: feSeries,
      isRef: isRef,
      lmRef: lmRef,
      eqRef: eqRef,
      feRef: feRef
    }


  }

  private _createSeriesF(addRef: boolean) {
    // slider values
    let slider = this.sliderF.value;
    let params = this.params;
    // model parameters
    let c0: number = slider.expectedOutput! + slider.wealth!, cy: number = .6, cr: number = 300, t0: number = 0.5 * slider.taxes!, t: number = 0.2,
      i0: number = slider.expectedTFP! * (1 - 4 * slider.effTax!), ir: number = 200, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = 3216.498516087168 + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    // NX curve and parameters
    let nx0 = 50, nxy = .3, nxyf = 0.25, nxr = 250, nxrf = 400;
    let NXcurve = (x: number) => {
      return params.nx0 - nxy * params.Y + nxyf * params.Yf - nxr * x + nxrf * params.rf;
    }
    let inverseNX = (x: number) => {
      return (-x + params.nx0 + nxrf * params.rf - nxy * params.Y + nxyf * params.Yf) / nxr;
    }


    let x: number = 1000, isSeries = [], lmSeries = [], eqSeries = [], feSeries;
    let isRef: any[] = [], lmRef: any[] = [], eqRef: any[] = [], feRef: any[] = [];

    let is = (x: number) => {
      return (c0 + G + i0 - cy * t0 - x + cy * x - nxyf * x - cy * t * x + params.nx0 +
        nxr * params.r + nxy * params.Y) / (cr + ir + nxrf);
    }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let eq = (-(l0 / lr) + c0 / (cr + ir + nxrf) + G / (cr + ir + nxrf) + i0 / (cr + ir + nxrf) + M / (lr * P) + piE - (cy * t0) / (cr + ir + nxrf) + params.nx0 / (cr + ir + nxrf) + (nxr * params.r) / (cr + ir + nxrf) + (nxy * params.Y) / (cr + ir + nxrf)) / (ly / lr + 1 / (cr + ir + nxrf) - cy / (cr + ir + nxrf) + nxyf / (cr + ir + nxrf) + (cy * t) / (cr + ir + nxrf));

    do {
      let point = {
        name: 'IS',
        x: x,
        y: is(x)
      };
      let point2 = {
        name: 'LM',
        x: x,
        y: lm(x)
      }

      isSeries.push(point);
      lmSeries.push(point2);
      x = x + 1500;
    } while (x <= 6000);

    // equilibrium series
    eqSeries = [
      { x: 0, y: is(eq), marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: eq,
        y: is(eq),
        color: 'blue',
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        },
      },
      { x: eq, y: -3, marker: { enabled: false } }
    ];
    feSeries = [
      { x: ybar, y: -3, marker: { enabled: false, radius: 0 } },
      { x: ybar, y: 5, marker: { enabled: false, radius: 0 } },
    ];

    if (addRef) {
      isRef = isSeries;
      lmRef = lmSeries;
      eqRef = [
        { x: 0, y: is(eq), marker: { enabled: false, radius: 0 } },
        {
          name: 'Initial equilibrium',
          x: eq,
          y: is(eq),
          color: 'rgba(93, 93, 93, 1)',
          marker: {
            symbol: 'circle',
            enabled: true,
            radius: 3
          }
        },
      ];
      feRef = feSeries;
    }

    this.params.rf = eqSeries[1].y;
    this.params.Yf = eqSeries[1].x;

    return {
      IS: isSeries,
      LM: lmSeries,
      EQ: eqSeries,
      FE: feSeries,
      isRef: isRef,
      lmRef: lmRef,
      eqRef: eqRef,
      feRef: feRef
    }

  }

}
