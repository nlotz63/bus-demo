import { AfterViewInit, Component, ElementRef, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transition, trigger, style, animate } from '@angular/animations';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatRadioModule } from '@angular/material/radio';
import { BusPubLibModule } from 'bus-pub-lib';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive10',
  standalone: true,
  imports: [CommonModule, MatRadioModule, BusPubLibModule],
  templateUrl: './interactive10.component.html',
  styleUrls: ['./interactive10.component.scss']
})
export class Interactive10Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  mode = signal(0);

  graph = computed(() => {
    let scaler = 30, xGood = 'apartments (thousands)', yGood = 'Rent (dollars per month)', title = 'Market for 2-Bedroom Apartments',caption = 'The market for two-bedroom apartments. The supply and demand curves intersect at the market clearing price of $1,500 and quantity of 35 thousand apartments. ', price = 1500, min = 1150, max = 1500, step = 25;

    if (this.mode() === 1) {
      scaler = .5, xGood = 'cheese (thousands of pounds)', yGood = 'Price (dollars per pound)', title = 'Market for Gourmet Cheese', caption = 'The market for gourmet cheese. The supply and demand curves intersect at the market clearing price of $25 per pound and quantity of 35 thousand pounds.', price = 25, min = 25, max = 32, step = 1;

    };
    return {
      scaler: scaler,
      xGood: xGood,
      yGood: yGood,
      title: title,
      caption: caption,
      price: price,
      min: min,
      max: max,
      step: step
    }
  });


  constructor(private el: ElementRef, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {

    this._setupGraph();
    
  }

  public setMode(value: number) {
    this.mode.set(value);
    this._setupGraph();
  }


  private _setupGraph() {
    const chartContainer = this.el.nativeElement.querySelector('#chart1');
    const series = this._createSeries();
    this.chart1 = new Highcharts.Chart(chartContainer, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: this.graph().caption
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.graph().title}`,
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      tooltip: { useHTML: true, enabled: true },
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
          valueDescriptionFormat: `quantity: {point.x:.0f}, {point.name}: {point.y:.2f} dollars.`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'line',
          name: 'D',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
        },
        {
          type: 'line',
          name: 'S',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.graph().xGood}` },
        min: 15,
        max: 55,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yGood}` },
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}: </b> ',
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.0f}`
          },
          label: { enabled: true }
        }
      },

    });
  
  }

  private _createSeries() {
    const graph = this.graph();
    const scaler = graph.scaler;
    let x = 15, a = 120, b = 2, c = -13, d = 1.8;
    let demandSeries = [], supplySeries = [];

    let demand = (x: number): number => {
      return scaler * (a - b * x);
    }

    let supply = (x: number): number => {
      return scaler * (c + d * x);
    }
    let qd = (y: number) => { return (y / scaler - a) / -b; }
    let qs = (y: number) => { return (y / scaler - c) / d; }

    do {
      let point = {
        name: 'Quantity demanded:',
        x: x,
        y: demand(x)
      }
      let point2 = {
        name: 'Quantity supplied:',
        x: x,
        y: supply(x)
      }
      demandSeries.push(point);
      supplySeries.push(point2);
      x = x + 5;

    } while (x <= 55);


    return {
      demand: demandSeries,
      supply: supplySeries
    }


  }



}
