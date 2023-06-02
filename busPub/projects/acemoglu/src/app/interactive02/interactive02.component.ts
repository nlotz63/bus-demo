import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as Highcharts from 'highcharts';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive02',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './interactive02.component.html',
  styleUrls: ['./interactive02.component.scss']
})
export class Interactive02Component implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;

  xGood: string = 'Jeans';
  yGood: string = 'Sweaters';
  priceX: number = 50;
  priceY: number = 25;
  income: number = 300;


  constructor(announcer: LiveAnnouncer) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    let series = this._createSeries();
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        styledMode: false,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The budget line shows all possible combinations of ${this.xGood} and ${this.yGood} that can be purchased with a given income. ${this.xGood} are shown on the x-axis and ${this.yGood} are shown on the y-axis.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Budget Line',
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
          valueDescriptionFormat: `quantity: {point.x:.0f} ${this.xGood}, quantity: {point.y:.0f} ${this.yGood}.`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'line',
          name: 'Budget line',
          lineWidth: 2,
          color: '#0771BD',
          data: series.budget
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood}` },
        min: 0,
        max: 14
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Quantity of ${this.yGood}` },
        min: 0,
        max: 20
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `{point.x:.1f} ${this.xGood}<br/>{point.y:.1f} ${this.yGood}`
          },
        }
      },


    });

  }

  private _createSeries() {
    let px = this.priceX, py = this.priceY, Y = this.income, x = 0;
    let series = [];

   let budgetLine = (x: number): number => { return Y / py - px / py * x; }

    do {
      let point = {
        x: x,
        y: budgetLine(x)
      }
      series.push(point);
      x++;

    } while (x <= Y / px);

    return {
      budget: series
    }

  }

}
