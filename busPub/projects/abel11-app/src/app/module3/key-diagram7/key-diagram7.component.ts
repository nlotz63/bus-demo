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
    this.slider.patchValue(value);
    let series = this._createSeries(false);
    let difference = series.FE[0].x - series.EQ[1].x;
    let eqLabel = Math.abs(difference) < 1 ? 'Long-run' : 'Short-run';
    this.chart.series[0].setData(series.AD);
    this.chart.series[1].setData(series.SRAS);
    this.chart.series[2].setData(series.FE);
    this.chart.series[3].setData(series.EQ);

    this.chart.series[3].update(
      {
        type: 'line',
        label: {
          useHTML: true,
          style: {fontSize: '11px', fontWeight: '400'},
          formatter: (): any => {
            return `${eqLabel}:</br>Y = $${series.EQ[0].x.toFixed(0)}</br>Price level = ${series.EQ[0].y.toFixed(0)}`;
          }
        }
      }
    )

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
    let newPrice: number;
    const subscription = this.playInterval.subscribe(() => {
      let series = this._createSeries(false);
      let difference = series.FE[0].x - series.EQ[1].x;
      if (Math.abs(difference) > 60) {
        if (difference < 0) {
          newPrice = this.slider.value.priceLevel! + 1;
        } else {
          newPrice = this.slider.value.priceLevel! - 1;
        }
        this.updateChart({ priceLevel: newPrice });
      } else if (Math.abs(difference) > 5 && Math.abs(difference) < 60) {
        if (difference < 0) {
          newPrice = this.slider.value.priceLevel! + .25;
        } else {
          newPrice = this.slider.value.priceLevel! - .25;
        }
        this.updateChart({ priceLevel: newPrice });
      } else if (Math.abs(difference) >= .9 && Math.abs(difference) < 5) {
        if (difference < 0) {
          newPrice = this.slider.value.priceLevel! + .05;
        } else {
          newPrice = this.slider.value.priceLevel! - .05;
        }
        this.updateChart({ priceLevel: newPrice });
      } else {
        subscription.unsubscribe();

        return;
      }
    });
  }

  private _setupChart() {
    let series = this._createSeries(true);
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
          name: 'AD',
          zIndex: 1,
          animation: false,
          data: series.AD
        },
        {
          type: 'line',
          name: 'SRAS',
          zIndex: 1,
          animation: false,
          data: series.SRAS
        },
        {
          type: 'line',
          name: 'LRAS',
          color: 'black',
          zIndex: 0,
          animation: false,
          data: series.FE,
        },
        {
          type: 'line',
          name: 'Eqilibrium',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: false,
          animation: false,
          data: series.EQ,
          marker: {
            enabled: true,
          },
          label: {
            useHTML: true,
            style: { fontSize: '11px', fontWeight: '400' },
            connectorAllowed: true,
            formatter: (): any => {
              return `Long-run:</br>Y = $${series.EQ[0].x.toFixed(0)}</br>Price level = ${series.EQ[0].y.toFixed(0)}`;
            }
          }
        },
        {
          type: 'line',
          name: 'Initial AD',
          dashStyle: 'Dash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: series.adRef
        },
        {
          type: 'line',
          name: 'Initial SRAS',
          dashStyle: 'Dash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: series.srasRef
        },
        {
          type: 'line',
          name: 'Initial LRAS',
          dashStyle: 'Dash',
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
          marker: {
            enabled: true,
          },
          label: {enabled: false}
        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 2000,
        max: 6750

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price level, P' },
        min: 25,
        max: 275,
        tickInterval: 50

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

    let x: number = 2500, adSeries = [], srasSeries = [], eqSeries = [], feSeries;
    let adRef: any[] = [], srasRef: any[] = [], feRef: any[] = [], eqRef: any[] = [];

    let eq = (cr * M + ir * M - cr * l0 * P - ir * l0 * P + c0 * lr * P + G * lr * P + i0 * lr * P +
      cr * lr * P * piE + ir * lr * P * piE -
      cy * lr * P * t0) / (P * (lr - cy * lr + cr * ly + ir * ly + cy * lr * t));

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

      adSeries.push(point);
      x = x + 25;
    } while (x < 6500);

    srasSeries = [
      { x: 2000, y: P, marker: { enabled: false, radius: 0 } },
      { x: 6500, y: P, marker: { enabled: false, radius: 0 } },
    ]

    // equilibrium series
    eqSeries = [
      {
        name: 'Equilibrium',
        x: eq,
        y: ad(eq),
        color: 'blue',
        marker: {
          symbol: 'circle',
          enabled: true
        }
      },
      { x: eq, y: 0, marker: { enabled: false, radius: 0 } }
    ];

    feSeries = [
      { x: ybar, y: 0, marker: { enabled: false, radius: 0 } },
      { x: ybar, y: 250, marker: { enabled: false, radius: 0 } },
    ]

    if (addRef) {
      adRef = adSeries;
      srasRef = srasSeries;
      feRef = feSeries;
      eqRef =  [
        {
          name: 'Equilibrium',
          x: eq,
          y: ad(eq),
          color: 'rgba(93, 93, 93, 1)',
          marker: {
            symbol: 'circle',
            enabled: true
          }
        },
        { x: eq, y: 0, marker: { enabled: false, radius: 0 } }
      ];
    }

    return {
      AD: adSeries,
      SRAS: srasSeries,
      EQ: eqSeries,
      FE: feSeries,
      adRef: adRef,
      srasRef: srasRef,
      feRef: feRef,
      eqRef: eqRef
    }

  }

}
