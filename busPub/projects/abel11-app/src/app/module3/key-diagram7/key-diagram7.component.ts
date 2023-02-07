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
  selector: 'app-key-diagram7',
  templateUrl: './key-diagram7.component.html',
  styleUrls: ['./key-diagram7.component.scss'],
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
export class KeyDiagram7Component {

  mode: number = 0;
  showPlayer: boolean = false;

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

    ],
    xAxis: {
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      title: { useHTML: true, text: 'Desired national saving S<sup>d</sup>, and desired investment, I<sup>d</sup> (billions of dollars)' },
      min: 0,
      max: 1750

    },
    yAxis: {
      gridLineWidth: 0,
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      tickWidth: 1,
      title: { useHTML: true, text: 'Real interest rate, r' },
      min: 0,
      max: 5

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


  }

  public playStep(mode: number) {
    this._setupChart();

  }

  private _setupChart() {
    this.chart = new Highcharts.Chart('chart1', this.chart1);

  }

  private _createSeries(addRef: boolean) {

}

}
