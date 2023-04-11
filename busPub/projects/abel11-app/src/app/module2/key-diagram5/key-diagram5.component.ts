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
  selector: 'app-key-diagram5',
  templateUrl: './key-diagram5.component.html',
  styleUrls: ['./key-diagram5.component.scss'],
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
export class KeyDiagram5Component implements OnInit, AfterViewInit {
  mode: number = 0;
  previousMode: number = 0;
  rwStep = .001
  showPlayer: boolean = false;
  investmentDesired: number = 625;
  savingDesired: number = 1067;
  saveRef: any[] = []
  investRef: any[] = [];
  saveRefF: any[] = []
  investRefF: any[] = [];
  qSaveRef: any[] = [];
  qInvestRef: any[] = [];
  qSaveRefF: any[] = [];
  qInvestRefF: any[] = [];

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  // Home slider group
  slider = new FormGroup({
    rRate: new FormControl(0),
    taxRate: new FormControl(0),
    expectedMPK: new FormControl(0),
    output: new FormControl(0),
    expectedOutput: new FormControl(0),
    wealth: new FormControl(0),
    expectedRealRate: new FormControl(0),
    govPurchases: new FormControl(0),
    taxes: new FormControl(0)
  });
  // Foreign slider group
  sliderF = new FormGroup({
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
  // Chart properties
  chart!: Highcharts.Chart;
  chart2!: Highcharts.Chart;

  desiredLending!: number;
  desiredBorrow!: number;
  message: string = `Raise the interest rate to increase desired lending at home and decrease desired borrowing in the foreign country.`;

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
      this.previousMode = this.mode;
    });
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);
  }

  // Public methods
  public playStep(value: any) {
    this.mode = value;
    if (value === 3 && this.previousMode === 2 || value === 5 && this.previousMode === 4) {
      this.previousMode = value;
      return;
    }
    this.slider.setValue({
      rRate: 0,
      taxRate: 0,
      expectedMPK: 0,
      output: 0,
      expectedOutput: 0,
      wealth: 0,
      expectedRealRate: 0,
      govPurchases: 0,
      taxes: 0
    });

    if (value !== 1) this.slider.patchValue({ rRate: 1.323 });
    this._setupChart(true);


    this.previousMode = value;
  }

  public updateChart(value: any, chart: number) {
    if (chart === 1) {
      this.slider.patchValue(value);
    } else {
      this.sliderF.patchValue(value);
    }
    let series = this._createSeries(false);
    let seriesF = this._createSeriesForeign(false);

    this._setMessage();

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
          name: 'Desired lending',
          zIndex: 1,
          animation: false,
          data: series.seriesNX,
          enableMouseTracking: false,
          zoneAxis: 'x',
          zones: [
            {
              value: series.qInvestment[0].x,
              dashStyle: 'Dot'
            },
            {
              value: series.qSaving[0].x,
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
          name: 'Sd',
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
          name: 'Sd',
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

      ],
    });
    this.chart2.update({
      series: [
        {
          type: 'spline',
          name: 'Saving',
          zIndex: 1,
          animation: false,
          data: seriesF.seriesSaving
        },
        {
          type: 'spline',
          name: 'Investment',
          zIndex: 1,
          animation: false,
          data: seriesF.seriesInvestment
        },
        {
          type: 'line',
          name: 'Desired borrowing',
          zIndex: 1,
          animation: false,
          data: seriesF.seriesNX,
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
          name: 'Sd',
          zIndex: 2,
          animation: false,
          data: seriesF.qSaving,
          label: {
            useHTML: true,
            format: 'S<sup>d</sup>'
          }
        },
        {
          type: 'line',
          name: 'Sd',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          color: 'black',
          data: seriesF.qInvestment,
          label: {
            useHTML: true,
            format: 'I<sup>d</sup>'
          },
          marker: {
            symbol: 'circle',
            radius: 4
          }
        },

      ],
    });
  }

  public messageBuilder(slider: string, startValue: any) {
  }

  // Private methods

  private _setupChart(addRef: boolean) {
    let series = this._createSeries(addRef);
    let seriesF = this._createSeriesForeign(addRef);
    this._setMessage();
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
      title: { text: 'Home Country' },
      legend: { enabled: false },
      series: [
        {
          type: 'spline',
          name: 'Saving',
          zIndex: 0,
          animation: false,
          data: series.seriesSaving,
          label: {
            useHTML: true,
            format: 'S'
          }
        },
        {
          type: 'spline',
          name: 'Investment',
          zIndex: 0,
          animation: false,
          data: series.seriesInvestment,
          label: {
            useHTML: true,
            format: 'I'
          }
        },
        {
          type: 'line',
          name: 'Desired lending',
          color: 'rgb(143, 36, 105)',
          zIndex: 1,
          lineWidth: 1.5,
          animation: false,
          marker: { enabled: false },
          data: series.seriesNX,
          zoneAxis: 'x',
          zones: [
            {
              value: series.qInvestment[0].x,
              dashStyle: 'Dot'
            },
            {
              value: series.qSaving[0].x,
              dashStyle: 'Solid'
            },
            { value: 2500, dashStyle: 'Dot' }
          ]
        },
        {
          type: 'line',
          name: 'Sd',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'black',
          data: series.qSaving,
          label: {
            useHTML: true,
            format: 'S<sup>d</sup>'
          },
          marker: {
            enabled: true,
            fillColor: 'orange',
            lineColor: 'black',
            lineWidth: 1,
            radius: 4,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Id',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'black',
          data: series.qInvestment,
          label: {
            useHTML: true,
            format: 'I<sup>d</sup>'
          },
          marker: {
            enabled: true,
            fillColor: 'orange',
            lineColor: 'black',
            lineWidth: 1,
            radius: 4,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Initial saving',
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: -1,
          data: series.savingRef,
          label: {
            enabled: false
          }
        },
        {
          type: 'line',
          name: 'Initial investment',
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: -1,
          data: series.investmentRef,
          label: {
            enabled: false
          }
        },
/*         {
          type: 'line',
          name: 'Sd Reference',
          zIndex: -1,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'rgb(112, 112, 112)',
          data: series.qSavingRef,
          label: {
            enabled: false
          },
          marker: {
            enabled: true,
            fillColor: 'rgb(112, 112, 112)',
            lineColor: 'black',
            lineWidth: 1,
            radius: 3,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Id Reference',
          zIndex: -1,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'rgb(112, 112, 112)',
          data: series.qInvestmentRef,
          label: {
            enabled: false
          },
          marker: {
            enabled: true,
            fillColor: 'rgb(112, 112, 112)',
            lineColor: 'black',
            lineWidth: 1,
            radius: 3,
            symbol: 'circle'
          }
        },
 */      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Desired national<sub></sub> saving S<sup>d</sup>, and desired investment, I<sup>d</sup>' },
        min: 0,
        max: 2000

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'World real interest rate, r<sub>w</sub>' },
        min: -1,
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
          }
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
      title: { text: 'Foreign Country' },
      legend: { enabled: false },
      series: [
        {
          type: 'spline',
          name: 'Saving foreign',
          zIndex: 1,
          animation: false,
          data: seriesF.seriesSaving,
          label: {
            useHTML: true,
            format: 'S<sub>For</sub>'
          }
        },
        {
          type: 'spline',
          name: 'Investment foreign',
          zIndex: 1,
          animation: false,
          data: seriesF.seriesInvestment,
          label: {
            useHTML: true,
            format: 'I<sub>For</sub>'
          }
        },
        {
          type: 'line',
          name: 'Desired borrowing',
          color: 'rgb(143, 36, 105)',
          zIndex: 1,
          lineWidth: 1.5,
          animation: false,
          marker: { enabled: false },
          data: seriesF.seriesNX,
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
          ]
        },
        {
          type: 'line',
          name: 'Sd',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'black',
          data: seriesF.qSaving,
          label: {
            useHTML: true,
            format: 'S<sup>d</sup>'
          },
          marker: {
            enabled: true,
            fillColor: 'orange',
            lineColor: 'black',
            lineWidth: 1,
            radius: 4,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Id',
          zIndex: 3,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'black',
          data: seriesF.qInvestment,
          label: {
            useHTML: true,
            format: 'I<sup>d</sup>'
          },
          marker: {
            enabled: true,
            fillColor: 'orange',
            lineColor: 'black',
            lineWidth: 1,
            radius: 4,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Initial saving',
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: -1,
          data: seriesF.savingRef,
          label: {
            enabled: false
          }
        },
        {
          type: 'line',
          name: 'Initial investment',
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: -1,
          data: seriesF.investmentRef,
          label: {
            enabled: false
          }
        },
/*         {
          type: 'line',
          name: 'Sd Reference',
          zIndex: -1,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'rgb(112, 112, 112)',
          data: seriesF.qSavingRef,
          label: {
            enabled: false
          },
          marker: {
            enabled: true,
            fillColor: 'rgb(112, 112, 112)',
            lineColor: 'black',
            lineWidth: 1,
            radius: 3,
            symbol: 'circle'
          }
        },
        {
          type: 'line',
          name: 'Id Reference',
          zIndex: -1,
          animation: false,
          dashStyle: 'Dot',
          lineWidth: 1,
          color: 'rgb(112, 112, 112)',
          data: seriesF.qInvestmentRef,
          label: {
            enabled: false
          },
          marker: {
            enabled: true,
            fillColor: 'rgb(112, 112, 112)',
            lineColor: 'black',
            lineWidth: 1,
            radius: 3,
            symbol: 'circle'
          }
        },
 */
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Desired national saving S<sup>d</sup><sub>For</sub>, and desired investment, I<sup>d</sup><sub>For</sub>' },
        min: 0,
        max: 2000

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'World real interest rate, r<sub>w</sub>' },
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
          label: {
            style: { fontWeight: '400' }
          }

        }

      }
    });

  }
  // Create series for home country
  private _createSeries(addRef: boolean) {
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = this.slider.value.rRate!, taxRate = this.slider.value.taxRate!, eMPK = this.slider.value.expectedMPK!, output = this.slider.value.output!, eOutput = this.slider.value.expectedOutput!, wealth = this.slider.value.wealth!, eRealRate = this.slider.value.expectedRealRate!, govPurchase = this.slider.value.govPurchases!, taxes = this.slider.value.taxes!;

    let saving = [], investment = [], qSaving: any[] = [], qInvestment: any[] = [], eq = [], savingRef: any[] = [], investmentRef: any[] = [], qSavingRef = [], qInvestmentRef = [], eqRef: any[] = [];

    let alpha = .00006, exponent = 1.6, exp1 = .5, beta = .23, x = 50,
      investShift = 7 - taxRate + eMPK, savingShift = -3.35 - output + eOutput + wealth - .25 * eRealRate + govPurchase - .3 * taxes;

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
      x = x + 25;

    } while (x <= 1700);

    let nx = [
      [0, rRate],
      {
        name: 'desired investment',
        x: inverseInvestment(rRate),
        y: rRate,
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      {
        name: 'desired saving',
        x: inverseSaving(rRate),
        y: rRate,
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      [2500, rRate]
    ];
    qSaving = [
      {
        x: inverseSaving(rRate),
        y: rRate,
        color: 'blue',
        marker: { enabled: true, Symbol: 'circle', }
      },
      [inverseSaving(rRate), -3]
    ];
    qInvestment = [
      {
        x: inverseInvestment(rRate),
        y: rRate,
        color: 'blue',
        marker: { enabled: true, Symbol: 'circle', }
      },
      [inverseInvestment(rRate), -3]
    ];

    this.desiredLending = inverseSaving(rRate) - inverseInvestment(rRate);


    this.savingDesired = inverseSaving(rRate);
    this.investmentDesired = inverseInvestment(rRate);

    if (addRef) {
      this.saveRef = saving;
      this.investRef = investment;
      this.qInvestRef = qInvestment;
      this.qSaveRef = qSaving

    }
    return {
      seriesSaving: saving,
      seriesInvestment: investment,
      seriesNX: nx,
      qSaving: qSaving,
      qInvestment: qInvestment,
      savingRef: this.saveRef,
      investmentRef: this.investRef,
      qInvestmentRef: this.qInvestRef,
      qSavingRef: this.qSaveRef
    }
  }

  // create foreign country series
  private _createSeriesForeign(addRef: boolean) {
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = this.slider.value.rRate!, taxRate = this.sliderF.value.taxRate!, eMPK = this.sliderF.value.expectedMPK!, output = this.sliderF.value.output!, eOutput = this.sliderF.value.expectedOutput!, wealth = this.sliderF.value.wealth!, eRealRate = this.sliderF.value.expectedRealRate!, govPurchase = this.sliderF.value.govPurchases!, taxes = this.sliderF.value.taxes!;

    let saving = [], investment = [], qSaving: any[] = [], qInvestment: any[] = [], eq = [], savingRef: any[] = [], investmentRef: any[] = [], qSavingRef = [], qInvestmentRef = [], eqRef: any[] = [];

    let alpha = .000095, exponent = 1.6, exp1 = .5, beta = .25, x = 0,
      investShift = 9 - taxRate + eMPK, savingShift = 0 - output + eOutput + wealth - .25 * eRealRate + govPurchase - .3 * taxes;

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
      x = x + 25;

    } while (x <= 1500);

    let nx = [
      [0, rRate],
      {
        name: 'desired investment',
        x: inverseInvestment(rRate),
        y: rRate,
        color: 'blue',
        marker: {
          symbol: 'circle',

        }
      },
      {
        name: 'desired saving',
        x: inverseSaving(rRate),
        y: rRate,
        color: 'blue',
        marker: {
          symbol: 'circle',
        }
      },
      [2500, rRate]
    ];
    qSaving = [
      {
        x: inverseSaving(rRate),
        y: rRate,
        color: 'blue',
        marker: { enabled: true, Symbol: 'circle', }
      },
      [inverseSaving(rRate), -3]
    ];
    qInvestment = [
      {
        x: inverseInvestment(rRate),
        y: rRate,
        color: 'blue',
        marker: { enabled: true, Symbol: 'circle', }
      },
      [inverseInvestment(rRate), -3]
    ];

    this.desiredBorrow = inverseInvestment(rRate) - inverseSaving(rRate);

    this.savingDesired = inverseSaving(rRate);
    this.investmentDesired = inverseInvestment(rRate);
    if (addRef) {
      this.saveRefF = saving;
      this.investRefF = investment;
      this.qInvestRefF = qInvestment;
      this.qSaveRefF = qSaving

    }
    return {
      seriesSaving: saving,
      seriesInvestment: investment,
      seriesNX: nx,
      qSaving: qSaving,
      qInvestment: qInvestment,
      savingRef: this.saveRefF,
      investmentRef: this.investRefF,
      qInvestmentRef: this.qInvestRefF,
      qSavingRef: this.qSaveRefF
    }
  }

  private _setMessage() {
    let difference = this.desiredBorrow - this.desiredLending;
    this.rwStep = Math.abs(difference) < 4 ? .0001 : .005;

    // update equilibrium message
    if (Math.abs(difference) < .05) {
      this.message = `Yay! You've found the equilibrium world real interest rate that clears the goods market.`;
    } else if ( difference <= .05) {
      this.message = `Lower the interest rate to decrease desired lending at home and increase desired borrowing in the foreign country.`
    } else {
      this.message = `Raise the interest rate to increase desired lending at home and decrease desired borrowing in the foreign country.`;

    }

  }
}
