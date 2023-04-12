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

  slider = new FormGroup({

  });


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
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 325,
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
          data: [1, 2, 4, 10,2],
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
          data: [],
          label: {
            useHTML: true,
            format: 'I'
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
        title: { useHTML: true, text: 'Desired national<sub></sub> saving S<sup>d</sup>, and desired investment, I<sup>d</sup>' },

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'World real interest rate, r<sub>w</sub>' },

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
        height: 325,
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
          data: [1, 2, 4, 10,2],
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
          data: [],
          label: {
            useHTML: true,
            format: 'I'
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
        title: { useHTML: true, text: 'Desired national<sub></sub> saving S<sup>d</sup>, and desired investment, I<sup>d</sup>' },

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'World real interest rate, r<sub>w</sub>' },

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

  private _createSeries(addRef: boolean) {

  }

}
