import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';

HC_export(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-fig94',
  templateUrl: './fig94.component.html',
  styleUrls: ['./fig94.component.scss']
})
export class Fig94Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;
  previousY = 900;

  slider = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(150),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(385),
    effTax: new FormControl(0.12),

    money: new FormControl(255000),
    priceLevel: new FormControl(100),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)


  });

  chart!: Highcharts.Chart;
  chart2!: Highcharts.Chart;

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);

  }

  public updateChart(value: any) {
    this.slider.patchValue(value);
    let series = this._createSeries(false);
    this.chart.series[0].setData(series.MS);
    this.chart.series[1].setData(series.MD);
    this.chart.series[2].setData(series.EQ);
    this.chart2.series[1].setData(series.EQ2);

    this.chart.series[1].update(
      {
        type: 'line',
        label: {
          enabled: true,
          useHTML: true,
          style: {
            fontSize: '12px',
            fontWeight: '400'
          },
          formatter: () => {
            return `MD (Y = ${series.EQ2[1].x})`;
          }

        }
      }
    );
    this.chart.series[2].update({
      type: 'line',
      label: {
        formatter: () => {
          return `Equilibrium:</br>M/P = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[1].y.toPrecision(2)}%`;
        }
        }
    })
    this.chart2.series[1].update({
      type: 'line',
      label: {
        enabled: true,
        useHTML: true,
        style: { fontSize: '11px', fontWeight: '400' },

        formatter: () => {
          let x = series.EQ2[1].x.toFixed(0), y = series.EQ2[1].y.toPrecision(2);
          return `${this.chart2.series[1].getName()}:</br>Y = ${x}</br>r = ${y}%`;
        }
      },
      accessibility: {
        description: `${this.chart2.series[1].getName()}: The point on the I S cuve has coordinates Y equals ${series.EQ2[1].x} and r equals ${series.EQ2[1].y}%`
      }
    });
    let announceMessage = () => {
      let message = '';
      let announce = () => {

      }
      if (this.previousY < series.EQ2[1].x) {
        message = `The money demand curve shifted up and the point on the LM curve moved up along the curve.`
      } else {
        message = `The money demand curve shifted down and the point on the LM curve moved down along the curve.`

      }
      this.announcer.announce(message);

     this.previousY = series.EQ2[1].x;


    }

    announceMessage();

  }

  public playStep(mode: number) {
    this.mode = mode;
    this.slider.setValue({
      expectedOutput: 900,
      wealth: 150,
      govPurchases: 600,
      taxes: 400,
      expectedTFP: 385,
      effTax: 0.12,

      money: 255000,
      priceLevel: 100,
      expectedInflation: 0.05,
      nominalRate: 0.02,

      supplyShock: 0,
      laborSupply: 0,
      capitalStock: 0
    })
    this._setupChart();

  }

  private _setupChart() {
    let series = this._createSeries(true);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'line',
        animation: false,
        height: 425,
        ignoreHiddenSeries: true,
      },
      tooltip: { enabled: false },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Money market' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'MS',
          zIndex: 0,
          animation: false,
          data: series.MS,
          accessibility: {
            description: 'A vertical line'
          },
          label: {
            style: {
              fontSize: '12px',
              fontWeight: '400'
            }
          }
        },
        {
          type: 'line',
          name: 'MD (Y = 900)',
          zIndex: 0,
          animation: false,
          data: series.MD,
          accessibility: {
            description: 'A downward-sloping straight line'
          },
          label: {
            style: {
              fontSize: '12px',
              fontWeight: '400'
            }
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 1,
          allowPointSelect: true,
          animation: false,
          data: series.EQ,
          marker: {
            enabled: true,
          },
          accessibility: {
            description: 'A point showing the intersection of the real money demand and real money supply curves'
          },
          label: {
            useHTML: true,
            style: {fontSize: '11px', fontWeight: '400'},
            formatter: () => {
              return `Equilibrium:</br>I = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[1].y.toPrecision(2)}%`;
            }
          }


        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Real money supply and real money demand' },
        min: 750,
        max: 3500

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Real interest rate, r' },
        min: -3,
        max: 5,
        tickInterval: 1

      },
      plotOptions: {
        series: {
          enableMouseTracking: false,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          label: {
            enabled: true
          },
          marker: {
            enabled: false,
            radius: 0
          },

        }

      }
    });
    this.chart2 = new Highcharts.Chart('chart2', {
      chart: {
        type: 'spline',
        animation: false,
        height: 425,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'LM Curve' },
      legend: { enabled: false },
      tooltip: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'LM curve',
          zIndex: -1,
          animation: false,
          data: series.LM,
          accessibility: {
            description: 'A upward-sloping straight line '
          },
          label: {
            style: {
              fontSize: '12px',
              fontWeight: '400'
            }
          }

        },
        {
          type: 'line',
          name: 'LM curve point',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 3,
          allowPointSelect: true,
          animation: false,
          data: series.EQ2,
          marker: {
            enabled: true,
          },
          accessibility: {
            description: 'A point that moves along the LM curve the corresponds to the intersection of the real money demand and real money supply curves.'
          },
          label: {
            enabled: true,
            useHTML: true,
            style: {fontSize: '11px', fontWeight: '400'},
            formatter: () => {
              return `LM curve point:</br>Y = ${series.EQ2[1].x.toFixed(0)}</br>r = ${series.EQ2[1].y.toPrecision(2)}`;
            }
          }

        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 900

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Real interest rate, r' },
        min: -2.1,
        max: 5,
        tickInterval: 1

      },
      plotOptions: {
        series: {
          enableMouseTracking: false,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          }
        }

      }
    });

  }

  private _createSeries(addRef: boolean) {
    // slider values
    let slider = this.slider.value;
    // model parameters
    let c0: number = 175, cy: number = .6, cr: number = 300, t0: number = 0.25 * slider.taxes!, t: number = 0.2,
      i0: number = 1850, ir: number = 220, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = slider.expectedOutput! + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    let x: number = 300, isSeries = [], lmSeries = [], eqSeries = [], eq2Series = [], feSeries, msSeries = [], mdSeries = [];

    let is = (x: number) => { return (c0 + G + i0 - cy * t0 - x * (1 - cy + cy * t)) / (cr + ir); }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let ns = (x: number) => { return (c0 + G - cy * t0 + x - ybar + cy * ybar - cy * t * ybar) / cr; }
    let md = (x: number) => { return (l0 - lr * piE - x + ly * ybar) / lr; }
    let eq = (-M + l0 * P - lr * P * piE + ly * P * ybar) / (lr * P);

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
      x = x + 25;
    } while (x < 7500);
    x = 50;

    do {
      let point = {
        name: 'Real money demand',
        x: x,
        y: md(x)
      }
      mdSeries.push(point);

      x = x + 5;
    } while (x < 3250);

    msSeries = [
      [M / P, -3],
      [M/P, 4.5]
    ];


    // equilibrium series
    eqSeries = [
      { x: 0, y: eq, marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: M/P,
        y: eq,
        color: '#008000',
        marker: {
          symbol: 'circle',
          radius: 4,
          enabled: true

        }
      },
      {
        x: M/P, y: -3, marker: {
          enabled: false, radius: 0
          }
      }
    ];
    eq2Series = [
      { x: 0, y: lm(ybar), marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: ybar,
        y: lm(ybar),
        color: '#008000',
        marker: {
          symbol: 'circle',
          enabled: true

        }
      },
      { x: ybar, y: -3, marker: { enabled: false } }
    ];
    feSeries = [
      [ybar, -3],
      [ybar, 2.25]
    ]

    return {
      IS: isSeries,
      LM: lmSeries,
      EQ: eqSeries,
      EQ2: eq2Series,
      FE: feSeries,
      MS: msSeries,
      MD: mdSeries
    }

  }

}
