import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { PlayerComponent } from '../../player/player/player.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgIf, CurrencyPipe } from '@angular/common';

HC_export(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);


@Component({
    selector: 'app-key-diagram4',
    templateUrl: './key-diagram4.component.html',
    styleUrls: ['./key-diagram4.component.scss'],
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
    imports: [NgIf, BusPubLibModule, MatTooltipModule, PlayerComponent, CurrencyPipe]
})

export class KeyDiagram4Component implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;
  investmentDesired: number = 625;
  savingDesired: number = 1067;
  saveRef: any[] = []
  investRef: any[] = [];

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private el: ElementRef) { }

  // create form controls for sliders



  slider = new FormGroup({
    rRate: new FormControl(1.75),
    taxRate: new FormControl(0),
    expectedMPK: new FormControl(0),
    output: new FormControl(0),
    expectedOutput: new FormControl(0),
    wealth: new FormControl(0),
    expectedRealRate: new FormControl(0),
    govPurchases: new FormControl(0),
    taxes: new FormControl(0)
  });

  prevRate = this.slider.value.rRate!;
  prevGovPurchase = this.slider.value.govPurchases!;
  prevTaxRate = this.slider.value.taxRate!;


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
    title: { text: 'National saving and investment in a small open economy' },
    legend: { enabled: false },
    accessibility: {
      point: {
        valueDescriptionFormat: `Quantity: {point.x:.0f} billion dollars, real interest rate: {point.y:.2f} percent.`
      }
    },
    tooltip: {
      enabled: true,
      useHTML: true,
    },
    series: [
      {
        type: 'spline',
        name: 'Saving',
        zIndex: 0,
        lineWidth: 2,
        animation: false,
        data: [],
        accessibility: {description: 'An upward-sloping, slightly convex curve.'}
      },
      {
        type: 'spline',
        name: 'Investment',
        zIndex: 0,
        lineWidth: 2,
        animation: false,
        data: [],
        accessibility: {description: 'A downward-sloping, slightly convex curve.'}
      },
      {
        type: 'line',
        name: 'Net exports',
        color: 'black',
        zIndex: 1,
        animation: false,
        marker: { enabled: false },
        data: [],
        zoneAxis: 'x',
        zones: [
          {
            value: this.investmentDesired,
            dashStyle: 'Dot'
          },
          {
            value: this.savingDesired,
            dashStyle: 'Solid'
          },
          { value: 1750, dashStyle: 'Dot' }
        ]
      },
      {
        type: 'line',
        name: 'Sd',
        zIndex: 3,
        animation: false,
        dashStyle: 'Dot',
        color: 'black',
        data: [],
        label: {
          useHTML: true,
          format: 'S<sup>d</sup>'
        },
        marker: {
          symbol: 'circle',
          radius: 4
        }
      },
      {
        type: 'line',
        name: 'Id',
        zIndex: 3,
        animation: false,
        dashStyle: 'Dot',
        color: 'black',
        data: [],
        label: {
          useHTML: true,
          format: 'I<sup>d</sup>'
        },
        marker: {
          symbol: 'circle',
          radius: 4
        }
      }


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
        color: '#C31229',
        tooltip: {
          headerFormat: '{series.name}<br/>',
          pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
        },
        label: {
          style: { fontWeight: '400' }
        },
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 4
        }

      }

    }
  }



  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this._createSeries(true);
  }

  ngAfterViewInit(): void {
    const chart1 = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart(chart1, this.chart1);
    this.playStep(this.mode);
  }

  // Public methods
  public playStep(value: any) {
    this.mode = value;
    this.slider.setValue({
      rRate: 1.75,
      taxRate: 0,
      expectedMPK: 0,
      output: 0,
      expectedOutput: 0,
      wealth: 0,
      expectedRealRate: 0,
      govPurchases: 0,
      taxes: 0
    });
    this._setupChart(true);
    this.updateChart(2);
    this.announcer.announce(`Step ${ this.mode + 1} has loaded`);

  }

  public updateChart(value: any) {
    this.slider.patchValue(value);
    let series = this._createSeries(false);

    this.chart.update({
      series: [
        {
          type: 'spline',
          name: 'Saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving
        },
        {
          type: 'spline',
          name: 'Investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment
        },
        {
          type: 'line',
          name: 'Net exports',
          zIndex: 1,
          animation: false,
          data: series.seriesNX,
          enableMouseTracking: false,
          zoneAxis: 'x',
          zones: [
            {
              value: this.investmentDesired,
              dashStyle: 'Dot'
            },
            {
              value: this.savingDesired,
              dashStyle: 'Solid'
            },
            { value: 2500, dashStyle: 'Dot' }
          ],
          tooltip: {
            pointFormat: ''
          },
          label: {
            style: { fontWeight: '400' }
          }
        },
        {
          type: 'line',
          name: 'S<sup>d</sup>      ',
          zIndex: 2,
          animation: false,
          data: series.qSaving,
          label: {
            useHTML: true,
            format: 'S<sup>d</sup>'
          }
        },
        {
          type: 'line',
          name: 'I<sup>d</sup>',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          color: 'black',
          data: series.qInvestment,
          label: {
            useHTML: true,
            format: 'I<sup>d</sup>'
          },
          marker: {
            symbol: 'circle',
            radius: 4
          }
        },

        {
          type: 'spline',
          name: 'initial saving',
          data: this.saveRef,
          dashStyle: 'Dash',
          lineWidth: 1,
          color: '#797979',
          visible: this.slider.value.govPurchases !== 0 ? true : false
        },
        {
          type: 'spline',
          name: 'initial investment',
          data: this.investRef,
          dashStyle: 'Dash',
          lineWidth: 1,
          color: '#797979',
          visible: this.slider.value.taxRate !== 0 ? true : false

        }

      ],
    });


  }

  public messageBuilder() {
    const sliderGroup = this.slider.value;
    let message = ``;
    let nx = (this.savingDesired - this.investmentDesired).toFixed(0);

    switch (this.mode) {
      case 0:
        if (this.prevRate < sliderGroup.rRate!) {
          message = `As the world real interest rate increased from ${this.prevRate.toFixed(2)}  percent to ${sliderGroup.rRate!.toFixed(2)} percent, net exports increased to ${nx} dollars.`;

        } else {
          message = `As the world real interest rate decreased from ${this.prevRate.toFixed(2)}  percent to ${sliderGroup.rRate!.toFixed(2)} percent, net exports decreased to ${nx} dollars.`;
        }
        this.prevRate = sliderGroup.rRate!;
        break;
      case 1:
        if (this.prevGovPurchase < sliderGroup.govPurchases!) {
          message = `As desired national saving increased (a shift of the saving curve to the right), net exports increased to ${nx} dollars.`;

        } else {
          message = `As desired national saving decreased (a shift of the saving curve to the left), net exports decreased to ${nx} dollars.`;
        }
        this.prevGovPurchase = sliderGroup.govPurchases!;
        break;
      case 2:
        if (this.prevTaxRate < sliderGroup.taxRate!) {
          message = `As desired investment increased (a shift of the investment curve to the right), net exports decreased to ${nx} dollars.`;
        } else {
          message = `As desired investment decreased (a shift of the investment curve to the left), net exports increased to ${nx} dollars.`;
        }
        this.prevTaxRate = sliderGroup.taxRate!;
        break;
      default:
        break;
    }
    this.announcer.announce(message);

  }

  // Private methods

  private _setupChart(addRef: boolean) {
    this._createSeries(addRef);
    switch (this.mode) {
      case 1:
        this.chart.addSeries({
          type: 'spline',
          name: 'initial saving',
          data: this.saveRef,
          dashStyle: 'LongDash',
          lineWidth: 1,
          zIndex: -1,
          color: '#797979',
          label: { enabled: false },
          accessibility: {description: 'An upward-sloping, slightly convex curve.'}
        });

        break;
      case 2:
        this.chart.addSeries({
          type: 'spline',
          name: 'initial investment',
          data: this.investRef,
          dashStyle: 'LongDash',
          lineWidth: 1,
          color: '#797979',
          label: { enabled: false },
          accessibility: {description: 'A downward-sloping, slightly convex curve.'}
        });
        break;

      default:

        break;
    }

  }

  private _createSeries(addRef: boolean) {
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = this.slider.value.rRate!, taxRate = this.slider.value.taxRate!, eMPK = this.slider.value.expectedMPK!, output = this.slider.value.output!, eOutput = this.slider.value.expectedOutput!, wealth = this.slider.value.wealth!, eRealRate = this.slider.value.expectedRealRate!, govPurchase = this.slider.value.govPurchases!, taxes = this.slider.value.taxes!;

    let saving = [], investment = [], qSaving: any[] = [], qInvestment: any[] = [], eq = [], savingRef: any[] = [], investmentRef: any[] = [], qSavingRef = [], qInvestmentRef = [], eqRef: any[] = [];

    // saving shift modified to produce desired shift: should be + govPurchases. investShift modified to produce desired shift: should be - taxRate
    let alpha = .00004, exponent = 1.6, exp1 = .5, beta = .2, x = 0,
      investShift = 7 + taxRate + eMPK, savingShift = -2 - output + eOutput + wealth - .25 * eRealRate - govPurchase - .3 * taxes;

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
      x = x < 400 ? x + 25 : x + 250;

    } while (x <= 2150);

    let nx = [
      { x: 0, y: rRate, accessibility: { enabled: false } },
      {
        name: 'desired investment',
        x: inverseInvestment(rRate),
        y: rRate,
        marker: {
          enabled: true,
          symbol: 'circle',
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1
        }
      },
      {
        name: 'desired saving',
        x: inverseSaving(rRate),
        y: rRate,
        color: 'blue',
        marker: {
          enabled: true,
          symbol: 'circle',
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1
        }
      },
      { x: 2500, y: rRate, accessibility: { enabled: false } }
    ];
    qSaving = [
      {
        x: inverseSaving(rRate),
        y: rRate,
        color: 'blue',
        marker: {
          enabled: true,
          symbol: 'circle',
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1
        },
        accessibility: { description: `Quantity of savings demanded` }
      },
      { x: inverseSaving(rRate), y: -3, accessibility: { enabled: false } }
    ];
    qInvestment = [
      {
        x: inverseInvestment(rRate),
        y: rRate,
        color: 'blue',
        marker: {
          enabled: true,
          symbol: 'circle',
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1
        },
        accessibility: { description: `Quantity of investment demanded` }
      },
      { x: inverseInvestment(rRate), y: -3, accessibility: { enabled: false } }
    ];


    this.savingDesired = inverseSaving(rRate);
    this.investmentDesired = inverseInvestment(rRate);
    if (addRef) {
      this.saveRef = saving;
      this.investRef = investment;
    }

    return {
      seriesSaving: saving,
      seriesInvestment: investment,
      seriesNX: nx,
      qSaving: qSaving,
      qInvestment: qInvestment,
      //equilibrium: eq,
      eqRef: eqRef,
      savingRef: savingRef,
      investmentRef: investmentRef

    }

  }

}
