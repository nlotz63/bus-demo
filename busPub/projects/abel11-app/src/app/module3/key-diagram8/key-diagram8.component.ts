import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_sonify from 'highcharts/modules/sonification';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PlayerComponent } from '../../player/player/player.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgIf } from '@angular/common';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
    selector: 'app-key-diagram8',
    templateUrl: './key-diagram8.component.html',
    styleUrls: ['./key-diagram8.component.scss'],
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
    imports: [NgIf, BusPubLibModule, MatButtonModule, MatTooltipModule, PlayerComponent, MatSnackBarModule]
})
export class KeyDiagram8Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;
  shortRunEquilibrium = 4000;
  longRunEquilibrium = 4000;
  prevEQ = 4000;
  prevFE = 4000;

  slider = new FormGroup({
    expectedOutput: new FormControl(75),
    wealth: new FormControl(100),
    govPurchases: new FormControl(600),
    taxes: new FormControl(400),
    expectedTFP: new FormControl(3558),
    effTax: new FormControl(0.12),

    money: new FormControl(255000),
    priceLevel: new FormControl(100),
    expectedPrice: new FormControl(100),
    expectedInflation: new FormControl(0.05),
    nominalRate: new FormControl(0.02),

    supplyShock: new FormControl(0),
    laborSupply: new FormControl(0),
    capitalStock: new FormControl(0)
  });

  playInterval = interval(300);
  chart!: Highcharts.Chart;


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private _snackBar: MatSnackBar, private el: ElementRef) { }

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
          style: { fontSize: '11px', fontWeight: '400' },
          formatter: (): any => {
            return `${eqLabel}:</br>Y = $${series.EQ[0].x.toFixed(0)}</br>P = ${series.EQ[0].y.toFixed(1)}</br>
            P<sup>e</sup> = ${this.slider.value.expectedPrice?.toFixed(1)}`;
          }
        },
        accessibility: {
          description: `${eqLabel}: Y = $${series.EQ[0].x.toFixed(0)} P = ${series.EQ[0].y.toFixed(0)}`
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
      expectedPrice: 100,
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

  public messageBuilder(sliderType: string) {
    let series = this._createSeries(false);
    let currentValue = sliderType === 'L R A S' ? series.FE[0].x : series.EQ[1].x,
      prevValue = sliderType === 'L R A S' ? this.prevFE : this.prevEQ;
    let direction: string, direction2: string = ``;

    if (sliderType === 'S R A S') {
      direction = prevValue < currentValue ? 'down and to the right' : 'up and to the left';
    } else {
      direction = prevValue < currentValue ? 'up and to the right' : 'down and to the left';
      direction2 = prevValue < currentValue ? 'right' : 'left';
    }
    let message = ``;

    if (sliderType !== 'LR' && sliderType !== 'L R A S') {
      message = `The ${sliderType} curve has shifted ${direction}.`;
      this.announcer.announce(message);

    } else if (sliderType !== 'LR' && sliderType === 'L R A S') {
      message = `The ${sliderType} curve has shifted ${direction2}, and the S R A S curve has also shifted to the ${direction2} but by a smaller amount.`;
      this.announcer.announce(message);

    } else {
      if (this.shortRunEquilibrium > this.longRunEquilibrium + 0.5) {
        message = `To restore long-run equilibrium, the expected price level will rise, shifting the SRAS curve up and to the left.`;
      } else if (this.shortRunEquilibrium < this.longRunEquilibrium - 0.5) {
        message = `To restore long-run equilibrium, the expected price level will fall, shifting the SRAS curve down and to the right.`;
      } else {
        message = `The economy is in long-rung equilibrium`;
      }
      this._snackBar.open(message, 'Close', { panelClass: 'econ-message', horizontalPosition: 'left', verticalPosition: 'top' });
    }

    if (sliderType === 'L R A S') {
      this.prevFE = currentValue;
    } else {
      this.prevEQ = currentValue;
    }

  }


  public restoreEquilibrium() {
    let newPrice: number;
    this.messageBuilder('LR');
    const subscription = this.playInterval.subscribe(() => {
      let series = this._createSeries(false);
      let difference = series.EQ[0].y - this.slider.value.expectedPrice!;
      if (Math.abs(difference) > 5) {
        if (difference > 0) {
          newPrice = this.slider.value.expectedPrice! + 1.1;
        } else {
          newPrice = this.slider.value.expectedPrice! - 1.1;
        }
      } else if (Math.abs(difference) >= 1 && Math.abs(difference) <= 5) {
        if (difference > 0) {
          newPrice = this.slider.value.expectedPrice! + .65;
        } else {
          newPrice = this.slider.value.expectedPrice! - .65;
        }
      } else if (Math.abs(difference) >= .25 && Math.abs(difference) < 1) {
        if (difference > 0) {
          newPrice = this.slider.value.expectedPrice! + .25;
        } else {
          newPrice = this.slider.value.expectedPrice! - .253;
        }
      } else if (Math.abs(difference) >= .01 && Math.abs(difference) < .25) {
        if (difference > 0) {
          newPrice = this.slider.value.expectedPrice! + .02;
        } else {
          newPrice = this.slider.value.expectedPrice! - .0215;
        }
      } else {
        subscription.unsubscribe();
        console.log('I was unsubscribed');

        return;
      }
      console.log(difference);
      this.updateChart({ expectedPrice: newPrice });
    });
  }

  private _setupChart() {
    let series = this._createSeries(true);
    const chart1 = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart(chart1, {
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
      title: { text: 'AD/AS Model: Misperceptions version' },
      legend: { enabled: false },
      tooltip: { enabled: true },
      sonification: {
        duration: 20000
      },
      accessibility: {
        point: {
          valueDescriptionFormat: `Output, Y: {point.x:.0f} billion dollars, Price level: {point.y:.2f}.`
        }
      },
      series: [
        {
          type: 'spline',
          name: 'AD',
          zIndex: 1,
          animation: false,
          data: series.AD,
          accessibility: {
            description: `A downward sloping curved line that becomes flatter as output increases.`
          }
        },
        {
          type: 'line',
          name: 'SRAS',
          zIndex: 1,
          animation: false,
          data: series.SRAS,
          accessibility: {
            description: `An upward-sloping straight line.`
          }
        },
        {
          type: 'line',
          name: 'LRAS',
          color: 'black',
          zIndex: 0,
          animation: false,
          data: series.FE,
          accessibility: {
            description: `A vertical straight line.`
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          zIndex: 2,
          allowPointSelect: false,
          animation: false,
          data: series.EQ,
          accessibility: {
            description: `Long-run: Y = $${series.EQ[1].x.toFixed(0)} Price level = ${series.EQ[0].y.toFixed(0)}`
          },
          label: {
            useHTML: true,
            style: { fontSize: '11px', fontWeight: '400' },
            connectorAllowed: true,
            formatter: (): any => {
              return `Long-run:</br>Y = $${series.EQ[0].x.toFixed(0)}</br>P = ${series.EQ[0].y.toFixed(1)}</br>
              P<sup>e</sup> = ${this.slider.value.expectedPrice?.toFixed(1)}`;
            }
          }
        },
        {
          type: 'spline',
          name: 'Initial AD',
          dashStyle: 'LongDash',
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
          dashStyle: 'LongDash',
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
          marker: {
            enabled: true,
          },
          label: { enabled: false }
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
          lineWidth: 2,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Output, Y: ${point.x:.0f} billion<br/>Price level: {point.y:.1f}'
          },
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2
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
    let M: number = slider.money!, P: number = slider.priceLevel!, Pe = slider.expectedPrice!, l0: number = slider.nominalRate! * 10000 + 800, ly: number = 0.5, lr: number = 500, piE: number = slider.expectedInflation! * 10 - 0.45, b = 45;

    let ybar = 4000 + slider.capitalStock! + slider.supplyShock! + slider.laborSupply!;

    let x: number = 2500, adSeries = [], srasSeries = [], eqSeries = [], feSeries;
    let adRef: any[] = [], srasRef: any[] = [], feRef: any[] = [], eqRef: any[] = [];

    let eq = (cr * l0 + ir * l0 - c0 * lr - G * lr - i0 * lr + b * lr * Pe - b * cy * lr * Pe +
      b * cr * ly * Pe + b * ir * ly * Pe - cr * lr * piE - ir * lr * piE + b * cy * lr * Pe * t +
      cy * lr * t0 - lr * ybar + cy * lr * ybar - cr * ly * ybar - ir * ly * ybar -
      cy * lr * t * ybar - Math.sqrt(Math.pow(-cr * l0 - ir * l0 + c0 * lr + G * lr + i0 * lr -
        b * lr * Pe + b * cy * lr * Pe - b * cr * ly * Pe - b * ir * ly * Pe + cr * lr * piE +
        ir * lr * piE - b * cy * lr * Pe * t - cy * lr * t0 + lr * ybar - cy * lr * ybar +
        cr * ly * ybar + ir * ly * ybar + cy * lr * t * ybar, 2) -
        4 * (-lr + cy * lr - cr * ly - ir * ly - cy * lr * t) * (b * cr * M + b * ir * M -
          b * cr * l0 * Pe - b * ir * l0 * Pe + b * c0 * lr * Pe + b * G * lr * Pe +
          b * i0 * lr * Pe + b * cr * lr * Pe * piE + b * ir * lr * Pe * piE -
          b * cy * lr * Pe * t0 + cr * l0 * ybar + ir * l0 * ybar - c0 * lr * ybar -
          G * lr * ybar - i0 * lr * ybar - cr * lr * piE * ybar - ir * lr * piE * ybar +
          cy * lr * t0 * ybar))) / (2 * (-lr + cy * lr - cr * ly - ir * ly - cy * lr * t))

    let ad = (x: number) => {
      return (cr * M + ir * M) / (cr * l0 + ir * l0 - c0 * lr - G * lr - i0 * lr - cr * lr * piE -
        ir * lr * piE + cy * lr * t0 + lr * x - cy * lr * x + cr * ly * x + ir * ly * x +
        cy * lr * t * x);
    }

    let sras = (x: number) => {
      return Pe + (x - ybar) / b;
    }
    do {
      let point = {
        name: 'AD',
        x: x,
        y: ad(x)
      };
      adSeries.push(point);
      x = x + 250;
    } while (x <= 6500);
    x = 2250;
    do {
      let point2 = {
        x: x,
        y: sras(x)
      }
      srasSeries.push(point2);
      x = x + 250;
    } while (x <= 6250);


    // equilibrium series
    eqSeries = [
      { x: 2000, y: ad(eq), marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } },
      {
        name: 'Equilibrium',
        x: eq,
        y: ad(eq),
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
      { x: eq, y: 0, marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } }
    ];

    feSeries = [
      { x: ybar, y: 0, marker: { enabled: false, radius: 1 } },
      { x: ybar, y: 250, marker: { enabled: false, radius: 1 } },
    ];

    this.shortRunEquilibrium = eq;
    this.longRunEquilibrium = ybar;

    if (addRef) {
      adRef = adSeries;
      srasRef = srasSeries;
      feRef = feSeries;
      eqRef = [
        { x: 2000, y: ad(eq), marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } },
        {
          name: 'Equilibrium',
          x: eq,
          y: ad(eq),
          marker: {
            symbol: 'circle',
            enabled: true,
            fillColor: 'rgb(225, 225, 225)',
            lineColor: 'black',
            lineWidth: 1,
            radius: 3
          }
        },
        { x: eq, y: 0, marker: { enabled: false, radius: 0 }, accessibility: { enabled: false } }
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
