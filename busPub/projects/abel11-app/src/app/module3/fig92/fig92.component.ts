import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


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
  selector: 'app-fig92',
  templateUrl: './fig92.component.html',
  styleUrls: ['./fig92.component.scss']
})
export class Fig92Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;

  slider = new FormGroup({
    expectedOutput: new FormControl(900),
    wealth: new FormControl(150),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(385),
    effTax: new FormControl(0.12),

    money: new FormControl(133200),
    priceLevel: new FormControl(120),
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
    this.chart.series[0].setData(series.NS);
    this.chart.series[1].setData(series.Invest);
    this.chart.series[2].setData(series.EQ);
    this.chart2.series[1].setData(series.EQ2);

    this.chart.series[0].update(
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
            return `Saving, S(Y = ${series.FE[0][0]})`;
          }

        }
      }
    );
    this.chart.series[2].update({
      type: 'line',
      label: {
        formatter: () => {
          return `Equilibrium:</br>I = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[1].y.toPrecision(2)}%`;
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
          return `${this.chart2.series[1].getName()}:</br>Y = ${x}</br>r = ${y}`;
        }
      },
      accessibility: {
        description: `${this.chart2.series[1].getName()}: The point on the I S cuve has coordinates Y equals ${series.EQ2[1].x} and r equals ${series.EQ2[1].y}%`
      }
    });

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

      money: 133200,
      priceLevel: 120,
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
        type: 'spline',
        animation: false,
        height: 425,
        ignoreHiddenSeries: true,
      },
      tooltip: { enabled: false },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'National Saving and Investment' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'Saving, S(Y = 1200)',
          zIndex: -1,
          animation: false,
          data: series.NS,
          accessibility: {
            description: 'An upward-sloping straight line'
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
          name: 'Investment, I',
          zIndex: -1,
          animation: false,
          data: series.Invest,
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
          enableMouseTracking: true,
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: true,
          animation: false,
          data: series.EQ,
          marker: {
            enabled: true,
          },
          accessibility: {
            description: 'A point showing the intersection of the national saving and investment curves'
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
        title: { useHTML: true, text: 'Desired national saving, and desired investment' },
        min: 750,
        max: 2500

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
      title: { text: 'IS Curve' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'IS curve',
          zIndex: -1,
          animation: false,
          data: series.IS,
          accessibility: {
            description: 'A downward-sloping straight line '
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
          name: 'IS curve point',
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
            description: 'A point that moves along the IS curve the corresponds to the intersection of the national saving and investment curve'
          },
          label: {
            enabled: true,
            useHTML: true,
            style: {fontSize: '11px', fontWeight: '400'},
            formatter: () => {
              return `IS curve point:</br>Y = ${series.EQ2[1].x.toFixed(0)}</br>r = ${series.EQ2[1].y.toPrecision(2)}`;
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
          enableMouseTracking: true,
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

    let x: number = 300, isSeries = [], lmSeries = [], eqSeries = [], eq2Series = [], feSeries, nsSeries = [], investSeries = [];

    let is = (x: number) => { return (c0 + G + i0 - cy * t0 - x * (1 - cy + cy * t)) / (cr + ir); }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let ns = (x: number) => { return (c0 + G - cy * t0 + x - ybar + cy * ybar - cy * t * ybar) / cr }
    let invest = (x: number) => { return (i0 - x) / ir }
    let eq = (cr * i0 - c0 * ir - G * ir + cy * ir * t0 + ir * ybar - cy * ir * ybar +
      cy * ir * t * ybar) / (cr + ir);

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
        name: 'Saving',
        x: x,
        y: ns(x)
      };
      let point2 = {
        name: 'Investment',
        x: x,
        y: invest(x)
      }
      nsSeries.push(point);
      investSeries.push(point2);

      x = x + 5;
    } while (x < 2400);

    // equilibrium series
    eqSeries = [
      { x: 0, y: invest(eq), marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: eq,
        y: invest(eq),
        color: '#008000',
        marker: {
          symbol: 'circle',
          radius: 4,
          enabled: true

        }
      },
      {
        x: eq, y: -3, marker: {
          enabled: false, radius: 0
          }
      }
    ];
    eq2Series = [
      { x: 0, y: invest(eq), marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: ybar,
        y: invest(eq),
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
      NS: nsSeries,
      Invest: investSeries
    }

  }

}
