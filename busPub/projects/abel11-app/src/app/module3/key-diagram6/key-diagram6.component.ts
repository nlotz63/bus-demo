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
    expectedOutput: new FormControl(0),
    wealth: new FormControl(0),
    govPurchases: new FormControl(0),
    taxes: new FormControl(0),
    expectedTFP: new FormControl(0),
    effTax: new FormControl(0),

    money: new FormControl(3),
    priceLevel: new FormControl(0),
    expectedInflation: new FormControl(0),
    nominalRate: new FormControl(0),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)


  });

  chart!: Highcharts.Chart;
  chart1: Highcharts.Options = {
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
        data: []
      },
      {
        type: 'line',
        name: 'LM curve',
        zIndex: 1,
        animation: false,
        data: []
      },
      {
        type: 'line',
        name: 'FE',
        color: 'black',
        zIndex: 0,
        animation: false,
        data: [],
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
        data: [],
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
  }




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
    this.chart.series[3].setData(series.EQ);


  }

  public playStep(mode: number) {
    this._setupChart();

  }

  private _setupChart() {
    this.chart = new Highcharts.Chart('chart1', this.chart1);

  }

  private _createSeries(addRef: boolean) {
    // model parameters
    let c0: number = 300, cy: number = .75, cr: number = 300, t0: number = 100, t: number = 0.2, i0: number = 200, ir: number = 200, G: number = 600;
    let M: number = 133200, P: number = 120, l0: number = 1000, ly: number = 0.5, lr: number = 500, piE: number = 0.05;
    let x: number = 0, isSeries = [], lmSeries = [], eqSeries = [];

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
    } while (x < 3000);

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

    return {
      IS: isSeries,
      LM: lmSeries,
      EQ: eqSeries
    }

}

}
