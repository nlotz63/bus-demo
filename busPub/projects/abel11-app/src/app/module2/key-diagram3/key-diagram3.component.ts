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
import HC_sonify from 'highcharts/modules/sonification';
import { PlayerComponent } from '../../player/player/player.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgIf } from '@angular/common';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);


@Component({
    selector: 'app-key-diagram3',
    templateUrl: './key-diagram3.component.html',
    styleUrls: ['./key-diagram3.component.scss'],
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
    imports: [NgIf, BusPubLibModule, MatButtonModule, MatCheckboxModule, PlayerComponent]
})


export class KeyDiagram3Component implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;
  currentEQ = 1021;
  currentRate = 0.61;
  prevEQ = 1021;
  preRate = 0.61;

  // create form controls for sliders



  slider = new FormGroup({
    rRate: new FormControl(0.61),
    taxRate: new FormControl(0),
    expectedMPK: new FormControl(0),
    output: new FormControl(0),
    expectedOutput: new FormControl(0),
    wealth: new FormControl(0),
    expectedRealRate: new FormControl(0),
    govPurchases: new FormControl(0),
    taxes: new FormControl(0),
    ricardian: new FormControl(false)
  });


  // Chart properties
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
    title: { text: 'Saving-Investment Model' },
    legend: { enabled: false },
    sonification: {
      duration: 10000
    },
    accessibility: {
      point: {
        valueDescriptionFormat: `quantity {point.x:.0f} billion dollars, real interest rate: {point.y:.2f} percent.`
      }
    },
    series: [

    ],
    xAxis: {
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      title: { useHTML: true, text: 'Desired national saving S<sup>d</sup>, and desired investment, I<sup>d</sup> (billions of dollars)' },
      min: 0,
      max: 2500

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
          pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
        },
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 2
        }
      }
    }
  }

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit() {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });

  }

  ngAfterViewInit() {
    this.chart = new Highcharts.Chart('chart1', this.chart1);
    this.playStep(this.mode);
  }

  // Public methods
  public playStep(value: any) {
    this.mode = value;
    this.slider.setValue({
      rRate: 0.61,
      taxRate: 0,
      expectedMPK: 0,
      output: 0,
      expectedOutput: 0,
      wealth: 0,
      expectedRealRate: 0,
      govPurchases: 0,
      taxes: 0,
      ricardian: false
    });
    this.preRate = 0.61;
    this.prevEQ = 1021;
    this._setupChart(true);
    this.announcer.announce(`Step ${this.mode + 1} has loaded or been reset.`)
  }

  public messageBuilder() {
    let message = ``;
    console.log(this.preRate, this.currentRate);
    switch (this.mode) {
      case 0:
        if (this.preRate < this.currentRate) {
          message = `The point moved up along the saving curve.`;
        } else {
          message = `The point moved down along the saving curve.`;
        }
        break;
      case 1:
        if (this.preRate < this.currentRate) {
          message = `The point moved up along the investment curve.`;
        } else {
          message = `The point moved down along the investment curve.`;
        }
        break;
      case 2:
        if (0.61 < this.currentRate) {
          message = `The quantity of saving supplied is greater than the quantity of investment demanded.`;
        } else if (0.61 > this.currentRate) {
          message = `The quantity of saving supplied is less than the quantity of investment demanded.`;
        } else {
          message = `The quantity of saving supplied is equal to the quantity of investment demanded. The market is in equilibrium.`;
        }
        break;
      case 5:
        if (this.prevEQ < this.currentEQ) {
          message = `The investment curve has shifted to the right.`;
        } else {
          message = `The investment curve has shifted to the left.`;
        }
        break;
      default:
        if (this.prevEQ < this.currentEQ) {
          message = `The saving curve has shifted to the right.`;
        } else {
          message = `The saving curve has shifted to the left.`;
        }
        break;
    }
    this.preRate = this.currentRate;
    this.prevEQ = this.currentEQ;
    this.announcer.announce(message);
  }

  //Private methods

  private _setupChart(addRef: boolean) {
    let series: any = this._createSeries(addRef);
    this.chart = new Highcharts.Chart('chart1', this.chart1);

    switch (this.mode) {
      case 0:
        this.chart.addSeries({
          type: 'spline',
          name: 'Saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving,
          accessibility: {
            description: `An upward-sloping, slightly convex, curve.`
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Point of interest',
          color: 'black',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          zIndex: 2,
          animation: false,
          data: series.qSaving,
          label: {
            enabled: false
          },
          accessibility: {
            point: {
              valueDescriptionFormat: `The point is at quantity of saving: {point.x:.0f} billion dollars and real interest rate: {point.y:.2f} percent.`
            }
          }
        });
        break;
      case 1:
        this.chart.addSeries({
          type: 'spline',
          name: 'Investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment,
          accessibility: {
            description: `A downward-sloping, slightly convex, curve.`
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Point of interest',
          color: 'black',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          zIndex: 2,
          animation: false,
          data: series.qInvestment,
          label: {
            enabled: false
          }
        });

        break;
      case 2:
        this.chart.addSeries({
          type: 'spline',
          name: 'Saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving,
          accessibility: {
            description: `An upward-sloping, slightly convex, curve.`
          }
        });
        this.chart.addSeries({
          type: 'spline',
          name: 'Investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment,
          accessibility: {
            description: `A downward-sloping, slightly convex, curve.`
          }

        });
        this.chart.addSeries({
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'ShortDot',
          lineWidth: 1,
          zIndex: 3,
          animation: false,
          data: series.equilibrium,
          label: {
            enabled: false
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Quantity of savings desired',
          color: 'black',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          zIndex: 2,
          animation: false,
          data: series.qSaving,
          label: { enabled: false }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Quantity of investment desired',
          color: 'black',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          zIndex: 2,
          animation: false,
          data: series.qInvestment,
          label: { enabled: false }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Initial equilibrium',
          color: '#797979',
          dashStyle: 'ShortDot',
          lineWidth: 1,
          zIndex: 2,
          animation: false,
          data: series.eqRef,
          label: { enabled: false }
        });
        break;

      default:
        this.chart.addSeries({
          type: 'spline',
          name: 'Saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving,
          accessibility: {
            description: `An upward-sloping, slightly convex, curve.`
          }
        });
        this.chart.addSeries({
          type: 'spline',
          name: 'Investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment,
          accessibility: {
            description: `A downward-sloping, slightly convex, curve.`
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'ShortDot',
          lineWidth: 1,
          zIndex: 3,
          animation: false,
          data: series.equilibrium,
          label: {
            enabled: false
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Initial equilibrium',
          color: '#797979',
          dashStyle: 'ShortDot',
          lineWidth: 1,
          zIndex: 2,
          animation: false,
          data: series.eqRef,
          visible: true,
          label: {
            enabled: false
          }
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Initial saving curve',
          color: '#797979',
          dashStyle: 'LongDash',
          lineWidth: 1,
          zIndex: 1,
          animation: false,
          data: series.savingRef,
          label: { enabled: false },
          visible: false
        });
        this.chart.addSeries({
          type: 'line',
          name: 'Initital investment curve',
          color: '#797979',
          dashStyle: 'LongDash',
          lineWidth: 1,
          zIndex: 1,
          animation: false,
          data: series.investmentRef,
          label: { enabled: false },
          visible: false
        });
        break;
    }


  }
  public _updateChart(value: any) {
    let series: any = this._createSeries(false);
    let slider = this.slider.value;

    switch (this.mode) {
      case 0:
        this.chart.series[0].setData(series.seriesSaving, true, false, false);
        this.chart.series[1].setData(series.qSaving, true, false, false);

        break;
      case 1:
        this.chart.series[0].setData(series.seriesInvestment, true, false, false);
        this.chart.series[1].setData(series.qInvestment, true, false, false);

        break;
      case 2:
        this.chart.series[0].setData(series.seriesSaving, true, false, false);
        this.chart.series[1].setData(series.seriesInvestment, true, false, false);
        this.chart.series[2].setData(series.equilibrium, true, false, false);
        this.chart.series[3].setData(series.qSaving, true, false, false);
        this.chart.series[4].setData(series.qInvestment, true, false, false);
        if (this.slider.value.rRate !== 0.61) this.chart.series[2].hide();
        if (this.slider.value.rRate === 0.61) this.chart.series[3].hide();
        if (this.slider.value.rRate === 0.61) this.chart.series[4].hide();
        if (this.slider.value.rRate === 0.61) this.chart.series[2].show();
        if (this.slider.value.rRate !== 0.61) this.chart.series[3].show();
        if (this.slider.value.rRate !== 0.61) this.chart.series[4].show();


        break;


      default:
        this.chart.series[0].setData(series.seriesSaving, true, false, false);
        this.chart.series[1].setData(series.seriesInvestment, true, false, false);
        this.chart.series[2].setData(series.equilibrium, true, false, false);
        if (slider.expectedMPK! + slider.taxRate! !== 0) this.chart.series[5].show();
        if (Math.abs(slider.expectedMPK! + slider.taxRate!) < .05) this.chart.series[5].hide();
        if (Math.abs(slider.expectedOutput! + slider.output! + slider.expectedRealRate! + slider.taxes! + slider.wealth! + slider.govPurchases!) >= .05) this.chart.series[4].show();
        if (Math.abs(slider.expectedOutput! + slider.output! + slider.expectedRealRate! + slider.taxes! + slider.wealth! + slider.govPurchases!) < .05) this.chart.series[4].hide();
        break;
    }

  }

  private _createSeries(addRef: boolean) {
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = this.slider.value.rRate!, taxRate = this.slider.value.taxRate!, eMPK = this.slider.value.expectedMPK!, output = this.slider.value.output!, eOutput = this.slider.value.expectedOutput!, wealth = this.slider.value.wealth!, eRealRate = this.slider.value.expectedRealRate!, govPurchase = this.slider.value.govPurchases!, taxes = this.slider.value.taxes!;

    let saving = [], investment = [], qSaving = [], qInvestment = [], eq = [], savingRef: any[] = [], investmentRef: any[] = [], eqRef: any[] = [];

    let alpha = .00004, exponent = 1.6, exp1 = .5, beta = .2, x = 0, taxCoefficient = this.slider.value.ricardian ? .02 : .3,
      investShift = 7 - taxRate + eMPK, savingShift = -2 - output + eOutput + wealth - .25 * eRealRate + govPurchase - taxCoefficient * taxes;

    let savingCurve = (x: number) => { return savingShift + alpha * Math.pow(x, exponent); };
    let investmentCurve = (x: number) => { return investShift - beta * Math.pow(x, exp1); }

    let inverseSaving = (x: number) => { return Math.pow((x - savingShift) / alpha, 1 / exponent); };
    let inverseInvestment = (x: number) => { return Math.pow((x - investShift) / beta, 1 / exp1); }

    let _findEq = (): number => {
      let lowX = 0, upX = 2000, midX = (lowX + upX) / 2, epsilon = .0001;
      let i = 0

      do {
        let diff = savingCurve(midX) - investmentCurve(midX);

        if (diff < 0) {
          lowX = midX;
          midX = (upX + midX) / 2;
        } else {
          upX = midX;
          midX = (lowX + midX) / 2;
        }
        i++;

      } while (Math.abs(savingCurve(midX) - investmentCurve(midX)) > epsilon);
      return midX;
    }

    do {
      let point = {
        x: x, y: savingCurve(x)
      }
      let point1 = {
        x: x, y: investmentCurve(x)
      }
      saving.push(point);
      investment.push(point1);
      x = x < 400 ? x + 50 : x + 200;

    } while (x <= 2000);

    // Key point series
    qSaving = [
      { x: 0, y: rRate, accessibility: { enabled: false } },
      {
        name: 'saving supplied',
        x: inverseSaving(rRate),
        y: rRate,
        marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'orange', lineColor: 'black', lineWidth: 1 }
      },
      { x: inverseSaving(rRate), y: - 3, accessibility: { enabled: false } }
    ];
    qInvestment = [
      { x: 0, y: rRate, accessibility: { enabled: false } },
      {
        name: 'investment supplied',
        x: inverseInvestment(rRate),
        y: rRate,
        marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'orange', lineColor: 'black', lineWidth: 1 }
      },
      { x: inverseInvestment(rRate), y: -3, accessibility: { enabled: false } }
    ];
    eq = [
      { x: 0, y: investmentCurve(_findEq()), accessibility: { enabled: false } },
      {
        name: 'Equilibrium',
        x: _findEq(),
        y: investmentCurve(_findEq()),
        marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'orange', lineColor: 'black', lineWidth: 1 }
      },
      { x: _findEq(), y: -3, accessibility: { enabled: false } }
    ];
    //reference series
    if (addRef) {
      eqRef = [
        { x: 0, y: investmentCurve(_findEq()), accessibility: { enabled: false } },
        {
          name: 'Equilibrium',
          x: _findEq(),
          y: investmentCurve(_findEq()),
          marker: { enabled: true, symbol: 'circle', radius: 4, fillColor: 'lightgrey', lineColor: 'black', lineWidth: 1 },
        },
        { x: _findEq(), y: -3, accessibility: { enabled: false } }
      ];
      savingRef = saving;
      investmentRef = investment;

    }
    this.currentEQ = eq[1].x;
    this.currentRate = rRate;

    return {
      seriesSaving: saving,
      seriesInvestment: investment,
      qSaving: qSaving,
      qInvestment: qInvestment,
      equilibrium: eq,
      eqRef: eqRef,
      savingRef: savingRef,
      investmentRef: investmentRef

    }
  }

}
