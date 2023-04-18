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
  selector: 'app-fig135',
  templateUrl: './fig135.component.html',
  styleUrls: ['./fig135.component.scss'],
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
export class Fig135Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showPlayer: boolean = false;
  chart!: Highcharts.Chart;
  SminusDref!: any[];
  NXref!: any[];
  eqRef!: any[];

  params = {
    Y: 5000,
    Yf: 4000,
    rf: 1.1351,
    nx0: 250
  }

  slider = new FormGroup({

  });


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this._createSeries(this.params, false);
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
    let series = this._createSeries(this.params, addRef);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 500,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Goods Market Equilibrium (open economy)' },
      legend: { enabled: false },
      series: [
        {
          type: 'spline',
          name: 'Sd minus Id',
          zIndex: 0,
          animation: false,
          data: series.SminusD,
          label: {
            useHTML: true,
            format: 'S<sup>d</sup> - I<sup>d</sup>'
          }
        },
        {
          type: 'spline',
          name: 'NX',
          zIndex: 0,
          animation: false,
          data: series.NX,
          label: {
            useHTML: true,
            format: '<i>NX</i>'
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          zIndex: 1,
          dashStyle: 'Dot',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          animation: false,
          data: series.EQ,
          label: {
            enabled: false,
            useHTML: true,
            format: '<i>NX</i>'
          }
        },

        {
          type: 'line',
          name: 'Initial saving',
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: -1,
          data: [],
          label: {
            enabled: false
          }
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Desired saving less desired investment, S<sup>d</sup> - I<sup>d</sup>, and net exports, NX' },
        min: -2000,
        max: 2200,
        plotLines: [
          {
            color: 'black',
            dashStyle: 'Solid',
            value: 0,
            width: 1,
            label: {
              text: 'NX = 0',
              rotation: 0,
              verticalAlign: 'top',
              align: 'left',
            }
          }
        ],


      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        min: -3,
        title: { useHTML: true, text: 'Domestic real interest rate, r' },

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          marker: {enabled: false},
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

  private _createSeries( params: any, addRef: boolean) {
    // math generate all curves and key points in the chart returns an object of arrays
    let rRate = 0, taxRate =0, eMPK = 0, output = 0, eOutput = 0, wealth = 0, eRealRate = 0, govPurchase = 0, taxes = 0;

    let SminusD = [], NX = [], qSaving: any[] = [], qInvestment: any[] = [];

    let alpha = .00006, exponent = 1.6, exp1 = .5, beta = .23, x = -3,
      investShift = 7 - taxRate + eMPK, savingShift = -3.35 - output + eOutput + wealth - .25 * eRealRate + govPurchase - .3 * taxes;

    let savingCurve = (x: number) => { return savingShift + alpha * Math.pow(x, exponent); };
    let investmentCurve = (x: number) => { return investShift - beta * Math.pow(x, exp1); }

    let inverseSaving = (x: number) => { return Math.pow((x - savingShift) / alpha, 1 / exponent); };
    let inverseInvestment = (x: number) => { return Math.pow((x - investShift) / beta, 1 / exp1); }

    // NX curve and parameters
    let nx0 = 50, nxy = .15, nxyf = 0.25, nxr = 250, nxrf = 400;
    let NXcurve = (x: number) => {
      return params.nx0 - nxy * params.Y + nxyf * params.Yf - nxr * x + nxrf * params.rf;
    }
    let inverseNX = (x: number) => {
      return (-x + params.nx0 + nxrf * params.rf - nxy * params.Y + nxyf * params.Yf) / nxr;
    }

    let _findEq = (): number => {
      let lowX = 0, upX = 9, midX = (lowX + upX) / 2, epsilon = .0001;
      let i = 0

      do {
        let diff = (inverseSaving(midX) - inverseInvestment(midX)) - NXcurve(midX);

        if (diff < 0) {
          lowX = midX;
          midX = (upX + midX) / 2;
        } else {
          upX = midX;
          midX = (lowX + midX) / 2;
        }
        i++;
        console.log(diff);

      } while (Math.abs((inverseSaving(midX) - inverseInvestment(midX)) - NXcurve(midX)) > epsilon && i < 100);
      return midX;
    }

    do {
      let point = {
        x: inverseSaving(x) - inverseInvestment(x), y: x
      }
      let point1 = {
        x: NXcurve(x), y: x
      }
      SminusD.push(point);
      NX.push(point1);
      x = x + .5;

    } while (x <= 8.5);

    let eqPt = _findEq();
    let eq = [
      [-2000, eqPt],
      {
        name: 'Equilibrium',
        x: NXcurve(eqPt),
        y: eqPt,
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
        name: 'Equilibrium',
        x: NXcurve(eqPt),
        y: -4,
        marker: {
          enabled: false,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
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



    if (addRef) {
      this.SminusDref = SminusD;
      this.NXref = NX;
      this.eqRef = eq;

    }
    return {
      SminusD: SminusD,
      NX: NX,
      EQ: eq,
      SminusDref: this.SminusDref,
      NXref: this.NXref,
      eqRef: this.eqRef,
    }
  }
}
