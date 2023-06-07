import { AfterViewInit, Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { MatButtonModule } from '@angular/material/button';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BusPubLibModule } from 'bus-pub-lib';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive03',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, ReactiveFormsModule, ],
  templateUrl: './interactive03.component.html',
  styleUrls: ['./interactive03.component.scss']
})
export class Interactive03Component implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;

  xGood: string = 'Jeans';

  sliderGroup = new FormGroup({
    initialPrice: new FormControl(50),
    newPrice: new FormControl(50)
  });



  constructor(private announcer: LiveAnnouncer) { }

  ngOnInit(): void {

    this.sliderGroup.valueChanges.subscribe((value) => {
      console.log('value Changes');
      this.updateGraph();

    });

  }

  ngAfterViewInit(): void {

    let series = this._createSeries();
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Consumer Surplus',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      tooltip: { useHTML: true },
      sonification: {
        duration: 6000,
        afterSeriesWait: 1000,
        defaultInstrumentOptions: {
          instrument: 'piano',
          mapping: {
            pitch: {
              min: 'c2',
              max: 'c6',
              scale: Highcharts.sonification.Scales?.majorPentatonic
            }
          }
        },
      },
      accessibility: {
        point: {
          valueDescriptionFormat: `quantity: {point.x:.0f} .`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },


      series: [
        {
          type: 'line',
          name: 'D<sub>Market</sub>',
          lineWidth: 2,
          zIndex: 1,
          color: '#0771BD',
          data: series.demand,
          label: {
            useHTML: true
          }
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          lineWidth: 1.5,
          zIndex: 2,
          color: 'black',
          data: series.initialPrice,
          label: {enabled: false}
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          lineWidth: 1.5,
          zIndex: 2,
          color: 'black',
          data: series.newPrice,
          label: {enabled: false}
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Consumer Surplus 1',
          opacity: .5,
          zIndex: -1,
          data: series.CS1,
          label: { enabled: true, format: 'Consumer Suplus', onArea: true}
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Consumer Surplus 2',
          color: 'salmon',
          opacity: .4,
          zIndex: -1,
          data: series.CS2
        }

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ` },
        min: 0,
        max: 100,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Quantity of ` },
        min: 0,
        max: 150,
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `{point.x:.1f} $`
          },
        }
      }
    });

  }

  public updateGraph() {
    let series = this._createSeries();
    this.chart.series[1].setData(series.initialPrice, false, false);
    this.chart.series[2].setData(series.newPrice, false, false, false);
    this.chart.series[3].setData(series.CS1, false, false, false);
    this.chart.series[4].setData(series.CS2, true, false, false);

  }

  private _createSeries() {

    let a = 125, b = 1.22, x = 0;
    let initP = this.sliderGroup.value.initialPrice!, newP = this.sliderGroup.value.newPrice!;

    let f = (x: number) => { return a - b * x; }, inverse = (x: number) => a / b - x / b;

    let demand: any[] = [], cs1: any[] = [], cs2: any[] = [];

    do {
      let point = {
        x: x,
        y: f(x)
      }
      demand.push(point);
      x = x + 10;

    } while (x <= 90);

    // area range series

    cs1 = [
      {
        x: 0,
        low: newP < initP ? initP : newP,
        high: f(0)
      },
      {
        x: newP < initP ? inverse(initP) : inverse(newP),
        low: newP < initP ? initP : newP,
        high: newP < initP ? initP : newP
      }
    ]

    cs2 = [
      {
        x: 0,
        low: newP < initP ? newP : initP,
        high: newP < initP ? initP : newP
      },
      {
        x: newP < initP ? inverse(initP) : inverse(newP),
        low: newP < initP ? newP : initP,
        high: newP < initP ? initP : newP
      },
      {
        x: newP < initP ? inverse(newP) : inverse(initP),
        low: newP < initP ? newP : initP,
        high: newP < initP ? newP : initP
      }

    ]

    let initPrice = [
      { x: 0, y: initP, accessibility: { enabled: false } },
      {
        x: inverse(initP), y: initP,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          fillColor: 'orange',
          lineWidth: 1,
          lineColor: 'black'
        }
      },
      { x: inverse(initP), y: 0, accessibility: { enabled: false } },
    ];
    let newPrice = [
      { x: 0, y: newP, accessibility: { enabled: false } },
      {
        x: inverse(newP), y: newP,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          fillColor: 'orange',
          lineWidth: 1,
          lineColor: 'black'
        }
      },
      { x: inverse(newP), y: 0, accessibility: { enabled: false } },
    ]

    return {
      demand: demand,
      initialPrice: initPrice,
      newPrice: newPrice,
      CS1: cs1,
      CS2: cs2
    }

  }

}
