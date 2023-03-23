import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { MatSnackBar } from '@angular/material/snack-bar';

HC_export(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-figure31',
  templateUrl: './figure31.component.html',
  styleUrls: ['./figure31.component.scss'],
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


export class Figure31Component implements OnInit, AfterViewInit {
  showPlayer: boolean = true;
  mode: number = 0;
  chart!: Highcharts.Chart;

  slider = new FormGroup({
    price: new FormControl(150)
  });

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });

  }
  ngAfterViewInit() {
    this.playStep(this.mode);
    this.slider.setValue(
      {
        price: 150
      }
    );

  }

  public playStep(mode: number) {
    this.mode = mode;

    this._setupChart(mode);

  }

  public updateChart(value: any) {

  }

  //private methods
  private _setupChart(mode: number) {
    let series = this._createSeries(true);
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
      title: { text: 'Demand Curve' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'Demand',
          zIndex: 0,
          lineWidth: 3,
          color: 'rgba(7, 113, 189, 1)',
          animation: false,
          data: series.demand,
          label: {
            style: { fontSize: '12px', fontWeight: '400' }
          },
          marker: {
            fillColor: 'black',
            radius: 6
          },
          accessibility: {
            description: 'A downward sloping straight line with 7 points'
          }
  
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Quantity (millions of pairs of shoes per week)' },
        min: 6,
        max: 15

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price (dollars per pair of shoes)' },
        min: 0,
        max: 200,
        tickInterval: 25

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Output: ${point.x:.0f} billion<br/>Price level: {point.y:.1f}'
          }
        }
      }
    });


  }

  private _createSeries(addRef: boolean) {
    let slider = this.slider.value, demandSeries: any[] = [];
    let x = 7, price = slider.price;
    let demandShift = 350, b = 25;

    let demand = (x: number) => {
      return demandShift - b * x;
    }

    do {
      let point = {
        x: x,
        y: demand(x)
      }
      demandSeries.push(point);
      x += 1;


    } while (x <= 13);

    return {
      demand: demandSeries
    }

}

}
