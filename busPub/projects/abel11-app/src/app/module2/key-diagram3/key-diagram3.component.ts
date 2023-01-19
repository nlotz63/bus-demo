import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';

HC_accessibility(Highcharts);
HC_seriesLabel(Highcharts);


@Component({
  selector: 'app-key-diagram3',
  templateUrl: './key-diagram3.component.html',
  styleUrls: ['./key-diagram3.component.scss']
})
export class KeyDiagram3Component implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;


// Chart properties
  chart!: Highcharts.Chart;

  chart1: Highcharts.Options = {
    chart: {
      type: 'spline',
      animation: false,
      height: 540,

    },
    credits: {
      text: 'Pearson Education',
      href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
    },
    title: { text: 'Labor Market' },
    legend: { enabled: false },
    series: [

    ],
    xAxis: {
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      min: 100,
      max: 300,
      title: { text: 'Labor, N (millions of workers)' }

    },
    yAxis: {
      gridLineWidth: 0,
      lineColor: '#757575',
      lineWidth: 1.,
      tickColor: '#757575',
      tickWidth: 1,
      min: 70,
      max: 100,
      title: { text: 'Real wage' }

    },
    plotOptions: {
      series: {
        enableMouseTracking: false,
        color: '#C31229'
      }

    }
}



  constructor(private ActiveRoute: ActivatedRoute, private announceer: LiveAnnouncer) { }

  ngOnInit() {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });

  }

  ngAfterViewInit() {
    this.chart = new Highcharts.Chart('chart1', this.chart1);

  }


}
