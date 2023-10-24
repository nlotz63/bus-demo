import { AfterViewInit, Component, ElementRef, OnInit, signal, computed, Signal } from '@angular/core';
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
import { ModelService, EconModel } from '../model.service';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive05',
  standalone: true,
  imports: [CommonModule, MatRadioModule, BusPubLibModule],
  templateUrl: './interactive05.component.html',
  styleUrls: ['./interactive05.component.scss'],
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
export class Interactive05Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;

  mode = signal(0);
  price = signal(1500);
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
      step: step,
    }
  });

  modelParams: Signal<EconModel> = computed(() => {

    if (this.mode() === 0) {
      return {
        yscale: 30,
        xMin: 15,
        xMax: 60,
        xStep: 9,
        demandIntercept: 120,
        supplyIntercept: -13,
        demandSlope: 2,
        supplySlope: 1.8,
        price1: this.price()
      }
    } else {
      return {
        yscale: .5,
        xMin: 15,
        xMax: 60,
        xStep: 9,
        demandIntercept: 120,
        supplyIntercept: -13,
        demandSlope: 2,
        supplySlope: 1.8,
        price1: this.price()

      }
  
    }
   
  });



  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this._setupStep();
  }

  public setMode(value: number) {
    this.mode.set(+value);
    const newPrice = +value === 0 ? 1500 : 25;
    this.price.set(newPrice);
    this._setupStep();
  }

  public updateGraph(value: number) {
    this.price.set(value);
    let series = this.modelService.demandSupply(this.modelParams());
    let priceTitle = '';

    if (value < series.EQ[1].y) {
      priceTitle = 'Price ceiling';
    } else if (this.graph().price > series.EQ[1].y) {
      priceTitle = 'Price floor';
    } else {
      priceTitle = 'Equilibrium price';
    }

    this.chart1.series[0].update({
      type: 'line',
      name: priceTitle,
      lineWidth: 2,
      zIndex: 1,
      data: series.priceLine
    }, false);
    this.chart1.series[1].update({
      type: 'arearange',
      name: 'DWL',
      data: series.DWL
    }, false);
    this.chart1.series[2].update({
      type: 'arearange',
      name: 'CS',
      data: series.CSseries
    }, false);
    this.chart1.series[3].update({
      type: 'arearange',
      name: 'PS',
      data: series.PSseries
    }, true);

  }

  // Private methods
  private _setupStep() {
    if (this.chart1) this.chart1.destroy();
    let series = this.modelService.demandSupply(this.modelParams());
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart1 = new Highcharts.Chart(container, {
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
          name: 'Equilibrium price',
          lineWidth: 2,
          color: 'black',
          zIndex: 1,
          data: series.priceLine
        },
        {
          type: 'arearange',
          name: 'DWL',
          color: '#FFFBCC',
          zIndex: -1,
          data: series.DWL
          
        },
        {
          type: 'arearange',
          name: 'CS',
          color: '#CDD5E8',
          zIndex: -1,
          data: series.CSseries
          
        },
        {
          type: 'arearange',
          name: 'PS',
          color: '#F3D6C8',
          zIndex: -1,
          data: series.PSseries
          
        },
        {
          type: 'line',
          name: 'Equilibrium',
          dashStyle: 'ShortDot',
          color: 'lightgrey',
          lineWidth: 0,
          zIndex: 2,
          data: series.EQ,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'equilibrium',
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          label: {
            enabled: false
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point at the intersection of the supply and demand curves.'
          }
        },
        {
          type: 'line',
          name: 'Demand',
          id: 'demand',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'demand',
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          accessibility: {
            description: 'A straight line that slopes down from left to right.'
          }

        },
        {
          type: 'line',
          name: 'Supply',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'supply'
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          accessibility: {
            description: 'A straight line that slopes up from left to right.'
          }

        },

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

}
