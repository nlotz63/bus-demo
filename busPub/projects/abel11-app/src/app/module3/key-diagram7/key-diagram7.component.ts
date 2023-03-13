import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';

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
  selector: 'app-key-diagram7',
  templateUrl: './key-diagram7.component.html',
  styleUrls: ['./key-diagram7.component.scss'],
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
  ]

})
export class KeyDiagram7Component {

  mode: number = 0;
  showPlayer: boolean = false;

  slider = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(100),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(3558),
    effTax: new FormControl(0.12),

    money: new FormControl(255000),
    priceLevel: new FormControl(100),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)
  });

  playInterval = interval(300);
  chart!: Highcharts.Chart;


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


  }

  public playStep(mode: number) {
    this.mode = mode;
    this.slider.setValue({
      expectedOutput: 75,
      wealth: 100,
      govPurchases: 600,
      taxes: 400,
      expectedTFP: 3558,
      effTax: 0.12,

      money: 255000,
      priceLevel: 100,
      expectedInflation: 0.05,
      nominalRate:0.02,

      supplyShock: 0,
      laborSupply: 0,
      capitalStock: 0
      })
      this._setupChart();

  }

  public restoreEquilibrium() {

  }

  private _setupChart() {
    let series = this._createSeries(true);
    console.log(series.AD);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 540,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'AD/AS Model' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'AD curve',
          zIndex: 1,
          animation: false,
          data: series.AD
        },
        {
          type: 'line',
          name: 'SRAS curve',
          zIndex: 1,
          animation: false,
          data: []
        },
        {
          type: 'line',
          name: 'LRAS',
          color: 'black',
          zIndex: 0,
          animation: false,
          data: [],
        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 2000,
        max: 7000

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price level, P' },

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
    let c0: number = slider.expectedOutput! + slider.wealth!, cy: number = .6, cr: number = 300, t0: number = 0.5 * slider.taxes!, t: number = 0.2,
      i0: number = slider.expectedTFP! * (1 - 4 * slider.effTax!), ir: number = 200, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = 4000 + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    let x: number = 2750, adSeries = [], lmSeries = [], eqSeries = [], feSeries;

    let is = (x: number) => { return (c0 + G + i0 - cy * t0 - x * (1 - cy + cy * t)) / (cr + ir); }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let eq = (-(c0 / (cr + ir)) - G / (cr + ir) - i0 / (cr + ir) + l0 / lr - M / (lr * P) - piE + (cy * t0) / (cr + ir)) / (-(ly / lr) - (1 - cy + cy * t) / (cr + ir));

    let ad = (x: number) => {
      return (cr * M + ir * M) / (cr * l0 + ir * l0 - c0 * lr - G * lr - i0 * lr - cr * lr * piE -
        ir * lr * piE + cy * lr * t0 + lr * x - cy * lr * x + cr * ly * x + ir * ly * x +
        cy * lr * t * x);
    }
    do {
      let point = {
        name: 'AD',
        x: x,
        y: ad(x)
      };
      let point2 = {
        name: 'LM',
        x: x,
        y: lm(x)
      }

      adSeries.push(point);
      lmSeries.push(point2);
      x = x + 25;
    } while (x < 6500);

    // equilibrium series
    eqSeries = [
      { x: 0, y: is(eq), marker: { enabled: false, radius: 0 } },
      {
        name: 'Equilibrium',
        x: eq,
        y: is(eq),
        color: 'blue',
        marker: {
          symbol: 'circle',
          enabled: true
        }
      },
      { x: eq, y: -3, marker: { enabled: false } }
    ];

    feSeries = [
      [ybar, -3],
      [ybar, 5]
    ]

    return {
      AD: adSeries,
      LM: lmSeries,
      EQ: eqSeries,
      FE: feSeries
    }

  }

}
