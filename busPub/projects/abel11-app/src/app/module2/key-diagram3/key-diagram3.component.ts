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
  ]
})


export class KeyDiagram3Component implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;

  // create form controls for sliders



  slider = new FormGroup({
    rRate: new FormControl(3),
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

  chart1: Highcharts.Options = {
    chart: {
      type: 'spline',
      animation: false,
      height: 540,
      ignoreHiddenSeries: true

    },
    credits: {
      text: 'Pearson Education',
      href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
    },
    title: { text: 'Saving-Investment Model' },
    legend: { enabled: false },
    series: [

    ],
    xAxis: {
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      title: { text: 'Labor, N (millions of workers)' },
      min: 0,
      max: 1750

    },
    yAxis: {
      gridLineWidth: 0,
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      tickWidth: 1,
      title: { text: 'Real wage' },
      min: 0,
      max: 5

    },
    plotOptions: {
      series: {
        enableMouseTracking: true,
        color: '#C31229'
      }

    }
}



  constructor(private ActiveRoute: ActivatedRoute, private announceer: LiveAnnouncer) { }

  ngOnInit() {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });

    //capture slider value changes and update the chart
    this.slider.valueChanges.subscribe((value) => {
      this._updateChart(value);
    }
    );
  }

  ngAfterViewInit() {
    this.chart = new Highcharts.Chart('chart1', this.chart1);
    this.playStep(this.mode);
  }

  // Public methods
  public playStep(value: any) {
    this.mode = value;
    this.chart.destroy();
   // this._createSeries(true);
    this._setupChart();
   // this.updateChart(23539, 25.99, 79.45, 0, 0, 0, 0);

  }

  public reset() {
    //this.chart.destroy();
  //  this._setupChart();
    //this.updateChart(23539, 25.99, 79.45, 0, 0, 0, 0);
  }


//Private methods

  private _setupChart() {
    let series: any = this._createSeries(false);

    this.chart = new Highcharts.Chart('chart1', this.chart1);

    switch (this.mode) {
      case 0:
        this.chart.addSeries({
          type: 'spline',
          name: 'saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving

        });
        this.chart.addSeries({
          type: 'line',
          name: '',
          color: 'darkgrey',
          lineWidth: 2,
          dashStyle: 'ShortDash',
          zIndex: 2,
          animation: false,
          data: series.qSaving

        });
        break;
      case 1:
        this.chart.addSeries({
          type: 'spline',
          name: 'investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment
        });
        this.chart.addSeries({
          type: 'line',
          name: '',
          color: 'darkgrey',
          lineWidth: 2,
          dashStyle: 'ShortDash',
          zIndex: 2,
          animation: false,
          data: series.qInvestment

        });

        break;

      default:
        this.chart.addSeries({
          type: 'spline',
          name: 'saving',
          zIndex: 1,
          animation: false,
          data: series.seriesSaving

        });
        this.chart.addSeries({
          type: 'spline',
          name: 'investment',
          zIndex: 1,
          animation: false,
          data: series.seriesInvestment

        });
        break;
    }


  //  this._updateChart(true);


}
  private _updateChart(value: any) {
    let series: any = this._createSeries(false);

    switch (this.mode) {
      case 0:
        this.chart.series[0].setData(series.seriesSaving, true, false, false);
        this.chart.series[1].setData(series.qSaving, true, false, false);

        break;
      case 1:
        this.chart.series[0].setData(series.seriesInvestment, true, false, false);
        this.chart.series[1].setData(series.qInvestment, true, false, false);

        break;

      default:
        this.chart.series[0].setData(series.seriesSaving, true, false, false);
        this.chart.series[1].setData(series.seriesInvestment, true, false, false);
            break;
    }

  }

  private _createSeries(addRef: boolean){
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = this.slider.value.rRate!, taxRate = this.slider.value.taxRate!, eMPK = this.slider.value.expectedMPK!, output = this.slider.value.output!, eOutput = this.slider.value.expectedOutput!, wealth = this.slider.value.wealth!, eRealRate = this.slider.value.expectedRealRate!, govPurchase = this.slider.value.govPurchases!, taxes = this.slider.value.taxes!;

    let saving = [], investment = [], qSaving = [], qInvestment = [], eq = [], savingRef = [], investmentRef = [], qSavingRef = [], qInvestmentRef = [], eqRef = [];

    let alpha = .00004, exponent = 1.6, exp1 = .5, beta = .16, x = 25,
      investShift = 7 - taxRate + eMPK, savingShift = .2 - output + eOutput + wealth - .25*eRealRate + govPurchase - .25*taxes;

    let savingCurve = (x: number) => { return savingShift + alpha * Math.pow(x, exponent);};
    let investmentCurve = (x: number) => { return investShift - beta * Math.pow(x, exp1); }

    let inverseSaving = (x: number) => { return Math.pow((x - savingShift) / alpha, 1 / exponent); };
    let inverseInvestment = (x: number) => { return Math.pow((x - investShift) / beta, 1 / exp1); }

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

    } while (x <= 2000);

    // Key point series
    qSaving = [
      [0, rRate],
      {
        name: 'saving supplied',
        x: inverseSaving(rRate),
        y: rRate,
        color: 'green',
        marker: { enabled: true, symbol: 'circle', radius: 4 }

      },
      [inverseSaving(rRate), 0]
    ];
    qInvestment = [
      [0, rRate],
      {
        name: 'investment supplied',
        x: inverseInvestment(rRate),
        y: rRate,
        color: 'green',
        marker: { enabled: true, symbol: 'circle', radius: 4 }

      },
      [inverseInvestment(rRate), 0]
    ];

    return {
      seriesSaving: saving,
      seriesInvestment: investment,
      qSaving: qSaving,
      qInvestment: qInvestment
    }
  }

}
