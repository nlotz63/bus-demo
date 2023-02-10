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
  selector: 'app-key-diagram6',
  templateUrl: './key-diagram6.component.html',
  styleUrls: ['./key-diagram6.component.scss'],
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
export class KeyDiagram6Component implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;

  slider = new FormGroup({
    expectedOutput: new FormControl(150),
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
    this.chart.series[0].setData(series.IS);
    this.chart.series[1].setData(series.LM);
    this.chart.series[2].setData(series.FE);
    this.chart.series[3].setData(series.EQ);


  }

  public playStep(mode: number) {
    this.mode = mode;
    this.slider.setValue({
      expectedOutput: 150,
    wealth: 150,
    govPurchases: 600,
    taxes: 400,
    expectedTFP: 385,
    effTax: 0.12,

    money: 133200,
    priceLevel: 120,
    expectedInflation: 0.05,
    nominalRate:0.02,

    supplyShock: 0,
    laborSupply: 0,
    capitalStock: 0
    })
    this._setupChart();

  }

  private _setupChart() {
    let series = this._createSeries(true);
    if (this.chart) this.chart.destroy();
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
      title: { text: 'ISLM Model' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'IS curve',
          zIndex: 1,
          animation: false,
          data: series.IS
        },
        {
          type: 'line',
          name: 'LM curve',
          zIndex: 1,
          animation: false,
          data: series.LM
        },
        {
          type: 'line',
          name: 'FE',
          color: 'black',
          zIndex: 0,
          animation: false,
          data: series.FE,
        },
        {
          type: 'line',
          name: '',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: true,
          animation: false,
          data: series.EQ,
          marker: {
            enabled: true,
          }
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Output, Y (billions of dollars)' },
        min: 0,
        max: 2400

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Real interest rate, r' },
        min: 0,
        max: 2.5

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
    let c0: number = slider.expectedOutput! + slider.wealth!, cy: number = .75, cr: number = 300, t0: number = 0.25 * slider.taxes!, t: number = 0.2,
    i0: number = slider.expectedTFP!*(1 - 4*slider.effTax!), ir: number = 200, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = 1289 + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    let x: number = 300, isSeries = [], lmSeries = [], eqSeries = [], feSeries;

    let is = (x: number) => { return (c0 + G + i0 - cy * t0 - x * (1 - cy + cy * t)) / (cr + ir); }
    let lm = (x: number) => { return (-M + l0 * P - lr * P * piE + ly * P * x) / (lr * P); }
    let eq = (-(c0 / (cr + ir)) - G / (cr + ir) - i0 / (cr + ir) + l0 / lr - M / (lr * P) - piE + (cy * t0) / (cr + ir)) / (-(ly / lr) - (1 - cy + cy * t) / (cr + ir));

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
    } while (x < 2500);

    // equilibrium series
    eqSeries = [
      { x: 0, y: is(eq), marker: {enabled: false, radius: 0 } },
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
      { x: eq, y: 0, marker: {enabled: false}}
    ];

    feSeries = [
      [ybar, 0],
      [ybar, 2.25]
    ]

    return {
      IS: isSeries,
      LM: lmSeries,
      EQ: eqSeries,
      FE: feSeries
    }

}

}
