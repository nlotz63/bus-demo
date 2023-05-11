import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_sonify from 'highcharts/modules/sonification';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { MatSnackBar } from '@angular/material/snack-bar';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
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
  shortRunEquilibrium = 4000;
  longRunEquilibrium = 4000;
  prevFE = 4000;
  prevEQ = 4000;

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


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private _snackBar: MatSnackBar) { }

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

    this.chart.series[0].setData(series.IS);
    this.chart.series[1].setData(series.LM);
    this.chart.series[2].setData(series.FE);
    this.chart.series[3].setData(series.EQ);
    this.chart.series[3].update(
      {
        type: 'line',
        label: {
          useHTML: true,
          style: { fontSize: '11px', fontWeight: '400' },
          formatter: (): any => {
            return `${eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[1].y.toPrecision(3)}%`;
          }
        },
        accessibility: {
          description: `${eqLabel}:</br>Y = $${series.EQ[1].x.toFixed(0)}</br>r = ${series.EQ[1].y.toPrecision(3)}%`
        }
      }
    );
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
      nominalRate: 0.02,

      supplyShock: 0,
      laborSupply: 0,
      capitalStock: 0
    });
    this.prevEQ = 4000;
    this.prevFE = 4000;
    this._snackBar.dismiss();
    this._setupChart();
    this.announcer.announce(`Step ${mode + 1} has loaded.`);
  }

  public restoreEquilibrium() {
    let newPrice: number;
    this.messageBuilder('LR');
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
      tooltip: { enabled: true },
      sonification: {
        duration: 20000
      },
      accessibility: {
        point: {
          valueDescriptionFormat: `Output, Y: {point.x:.0f} billion dollars, Real interest rate: {point.y:.2f} percent.`
        }
      },
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
        min: -2.1,
        max: 5

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          lineWidth: 2,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Output, Y: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          marker: { enabled: false, radius: 2, symbol: 'circle' }
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
      x = x + 500;
    } while (x <= 7000);

    // equilibrium series
    eqSeries = [
      { x: 0, y: is(eq), marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } },
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
      { x: eq, y: -3, marker: { enabled: false }, accessibility: { enabled: false } }
    ];
    feSeries = [
      { x: ybar, y: -3, marker: { enabled: false, radius: 1 } },
      { x: ybar, y: 5, marker: { enabled: false, radius: 1 } },
    ];

    this.shortRunEquilibrium = eq;
    this.longRunEquilibrium = ybar;

    if (addRef) {
      isRef = isSeries;
      lmRef = lmSeries;
      eqRef = [
        { x: 0, y: is(eq), marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } },
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
        { x: eq, y: 0, marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } }
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

  public messageBuilder(sliderType: string) {
    let series = this._createSeries(false);
    let currentValue = sliderType === 'F E' ? series.FE[0].x : series.EQ[1].x,
    prevValue = sliderType === 'F E' ? this.prevFE : this.prevEQ;
    let direction: string = prevValue < currentValue ? 'right' : 'left';
    let message = ``;



    if (sliderType !== 'LR') {
      message = `The ${sliderType} curve has shifted to the ${direction}.`;
      this.announcer.announce(message);

    } else {
      if (this.shortRunEquilibrium > this.longRunEquilibrium + 0.5) {
        message = `To restore long-run equilibrium, the price level will rise, shifting the LM curve up and to the left.`;
      } else if (this.shortRunEquilibrium < this.longRunEquilibrium - 0.5) {
        message = `To restore long-run equilibrium, the price level will fall, shifting the LM curve down and to the right.`;
      } else {
        message = `The economy is in long-rung equilibrium`;
      }
      this._snackBar.open(message, 'Close', { panelClass: 'econ-message', horizontalPosition: 'left', verticalPosition: 'top' });
    }

    if (sliderType === 'F E') {
      this.prevFE = currentValue;
    } else {
      this.prevEQ = currentValue;
    }

  }
}
