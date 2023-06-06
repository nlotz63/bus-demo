import { AfterViewInit, Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as Highcharts from 'highcharts';
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

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive02',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './interactive02.component.html',
  styleUrls: ['./interactive02.component.scss']
})
export class Interactive02Component implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;

  xGood: string = 'Jeans';
  yGood: string = 'Sweaters';
  budgetTitle: string = 'Clothing Budget'
  priceX: number = 50;
  priceY: number = 25;
  income = signal(300);
  minX = computed(() => {
    let value = this.income() / 14;
    return +value.toPrecision(4);
  });
  minY = computed(() => {
    let value = this.income() / 20;
    return +value.toPrecision(4);

  });

  budgetProps = new FormGroup(
    {
      priceX: new FormControl(50),
      priceY: new FormControl(25),
      income: new FormControl(300)
    }
  )

  constructor(announcer: LiveAnnouncer) {}

  ngOnInit(): void {
    this.budgetProps.valueChanges.subscribe((value) => {
      this.priceX = value.priceX!;
      this.priceY = value.priceY!;
      if(value.income !== null) this.income.set(value.income!);
      if(this.priceX !== null && this.priceY !== null && this.income !== null ) this._updateGraph();

    });


  }

  ngAfterViewInit(): void {
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
        text: `The budget constraint shows all possible bundle of ${this.xGood} and ${this.yGood} that could be purchased with a given income. ${this.xGood} are shown on the x-axis and ${this.yGood} are shown on the y-axis.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Budget Constraint',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: true },
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
          name: 'Budget constraint',
          lineWidth: 2,
          color: '#0771BD',
          data: series.budget,
          label: { enabled: false}
        },
        {
          type: 'area',
          name: 'Budget set',
          zIndex: -1,
          color: '#FFC9B2',
          data: series.budget,
          visible: true
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood}` },
        min: 0,
        max: 14,
        tickInterval: 2
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Quantity of ${this.yGood}` },
        min: 0,
        max: 20,
        tickInterval: 2
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `{point.x:.1f} ${this.xGood}<br/>{point.y:.1f} ${this.yGood}`
          },
        }
      },
    });

  }

  private _createSeries() {
    let px = this.priceX, py = this.priceY, Y = this.income(), x = 0;
    let series = [], setSeries = [], maxX = Y/px, step = maxX/4;

   let budgetLine = (x: number): number => { return Y / py - px / py * x; }

    do {
      let point = {
        x: x,
        y: budgetLine(x)
      }

      series.push(point);
      x = x + step;

    } while (x <= maxX );

    return {
      budget: series
    }

  }

  private _updateGraph() {
    let series = this._createSeries();
    this.chart.series[0].update({
      type: 'line',
      data: series.budget
    }, false);
    this.chart.series[1].update({
      type: 'area',
      data: series.budget
    }, true);
  }

}
