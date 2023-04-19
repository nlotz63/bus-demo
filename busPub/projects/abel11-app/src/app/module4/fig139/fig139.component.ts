import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';
import { interval } from 'rxjs';


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

})

export class Fig139Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;
  chart!: Highcharts.Chart;
  chart2!: Highcharts.Chart;

  shortRunEquilibrium = 4000;
  longRunEquilibrium = 4000;

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

  sliderF = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(100),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(3558),
    effTax: new FormControl(0.12),

    money: new FormControl(200000),
    priceLevel: new FormControl(100),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)
  });


  playInterval = interval(300);


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this._createSeries(false);
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);
  }

  //public methods

  public playStep(value: number) {
    this.mode = value;
    this._setupChart(true);

  }

  public updateChart(value: any) {

  }

  // private methods

  private _setupChart(addRef: boolean) {
    let series = this._createSeries(addRef);
    let seriesF = this._createSeriesF(addRef);

    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 350,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'ISLM (Home)' },
      legend: { enabled: false },
      tooltip: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'IS curve',
          zIndex: 1,
          animation: false,
          data: series.IS,
          accessibility: {
            description: `A downward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'LM curve',
          zIndex: 1,
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
            useHTML: true,
            style: { fontSize: '11px', fontWeight: '400' },
            connectorAllowed: true,
            formatter: (): any => {
              return `Long-run:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`;
            }
          },
          accessibility: {
            description: `Long-run:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[0].y.toPrecision(2)}%`
          }
        },
        {
          type: 'line',
          name: 'Initial IS',
          dashStyle: 'Dash',
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
          dashStyle: 'Dash',
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
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          marker: { enabled: false, radius: 0 }
        }

      }
    });

    this.chart2 = new Highcharts.Chart('chart2', {
      chart: {
        type: 'spline',
        animation: false,
        height: 350,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'ISLM (Foreign)' },
      legend: { enabled: false },
      tooltip: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'IS curve',
          zIndex: 1,
          animation: false,
          data: seriesF.IS,
          accessibility: {
            description: `A downward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'LM curve',
          zIndex: 1,
          animation: false,
          data: seriesF.LM,
          accessibility: {
            description: `An upward sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'FE',
          color: 'black',
          zIndex: 0,
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
            useHTML: true,
            style: { fontSize: '11px', fontWeight: '400' },
            connectorAllowed: true,
            formatter: (): any => {
              return `Long-run:</br>Y = $${seriesF.EQ[1].x.toFixed(0)}</br>r = ${seriesF.EQ[0].y.toPrecision(2)}%`;
            }
          },
          accessibility: {
            description: `Long-run:</br>Y = $${seriesF.EQ[1].x.toFixed(0)}</br>r = ${seriesF.EQ[0].y.toPrecision(2)}%`
          }
        },
        {
          type: 'line',
          name: 'Initial IS',
          dashStyle: 'Dash',
          color: 'rgba(93, 93, 93, 1)',
          lineWidth: 1,
          zIndex: -1,
          label: { enabled: false },
          visible: true,
          animation: false,
          data: seriesF.isRef,
        },
        {
          type: 'line',
          name: 'Initial LM',
          dashStyle: 'Dash',
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
          dashStyle: 'Dash',
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
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          marker: { enabled: false, radius: 0 }
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

    let x: number = 1000, isSeries = [], lmSeries = [], eqSeries = [], feSeries;
    let isRef: any[] = [], lmRef: any[] = [], eqRef: any[] = [], feRef: any[] = [];

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
      x = x + 1500;
    } while (x <= 7000);

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
      { x: eq, y: -4, marker: { enabled: false } }
    ];
    feSeries = [
      { x: ybar, y: -4, marker: { enabled: false, radius: 0 } },
      { x: ybar, y: 5, marker: { enabled: false, radius: 0 } },
    ];

    this.shortRunEquilibrium = eq;
    this.longRunEquilibrium = ybar;

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
            radius: 4
          }
        },
        { x: eq, y: 0, marker: { enabled: false, radius: 0 } }
      ];
      feRef = feSeries;
    }


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
    // model parameters
    let c0: number = slider.expectedOutput! + slider.wealth!, cy: number = .6, cr: number = 300, t0: number = 0.5 * slider.taxes!, t: number = 0.2,
      i0: number = slider.expectedTFP! * (1 - 4 * slider.effTax!), ir: number = 200, G: number = slider.govPurchases!;
    let M: number = slider.money!, P: number = slider.priceLevel!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45;

    let ybar = 3461
      + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    let x: number = 1000, isSeries = [], lmSeries = [], eqSeries = [], feSeries;
    let isRef: any[] = [], lmRef: any[] = [], eqRef: any[] = [], feRef: any[] = [];

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

    this.shortRunEquilibrium = eq;
    this.longRunEquilibrium = ybar;

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
            radius: 4
          }
        },
        { x: eq, y: 0, marker: { enabled: false, radius: 0 } }
      ];
      feRef = feSeries;
    }

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
