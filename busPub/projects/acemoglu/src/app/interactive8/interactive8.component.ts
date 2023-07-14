import { AfterViewInit, Component, OnInit, Input, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import * as Highcharts from 'highcharts';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { MatRadioModule } from '@angular/material/radio';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

interface SliderGroup {
  worldPrice: FormControl<number | null>,
  tariff: FormControl<number | null>
}

@Component({
  selector: 'app-interactive8',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, ReactiveFormsModule],
  templateUrl: './interactive8.component.html',
  styleUrls: ['./interactive8.component.scss']
})
export class Interactive8Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  price = signal(50);

  sliderGroup = new FormGroup<SliderGroup>({
    worldPrice:  new FormControl(35),
    tariff: new FormControl(40)
  })

  constructor( private el: ElementRef, private announcer: LiveAnnouncer) { }
  
  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this._setupGraph()
    
  }

  public updateGraph() {

  }

  // private methods

  private _setupGraph() {
    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart1 = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        styledMode: false,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The market for running shoes in equilibrium. The supply and demand curves intersect at the market-clearing price of $50 per pair and quantity of 35 thousand pairs per month.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Market for running shoes',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      tooltip: { useHTML: true },
      sonification: {
        duration: 20000,
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
          valueDescriptionFormat: `quantity {point.x:.0f} thousands of pairs, price: {point.y:.2f} dollars.`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'line',
          name: 'Equilibrium',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 2,
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
        {
          type: 'line',
          name: 'Q<sub>s</sub>',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          color: 'black',
          zIndex: 1,
          data: series.QSseries,
          label: {
            enabled: false,
            useHTML: true
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point on the supply curve at the current market price.'
          }
        },
        {
          type: 'line',
          name: 'Q<sub>d</sub>',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          color: 'black',
          zIndex: 1,
          label: {
            enabled: false,
            useHTML: true
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point on the demand curve at the current market price.'
          }
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Quantity (billions of barrels of oil per year)' },
        min: 15,
        max: 55
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price per barrel' },
        min: 10,
        max: 90
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `{point.name} {point.x:.0f} billion<br/>Price: \${point.y:.2f}`
          },
        }
      },
      annotations: [
        {
          visible: false,
          shapes: [
            {
              stroke: 'black',
              type: 'path',
              strokeWidth: 1,
              points: [
                {
                  x: 50,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
                {
                  x: 20,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
              ],
              markerEnd: 'arrow',

            },
            {
              stroke: 'black',
              type: 'path',
              strokeWidth: 1,
              points: [
                {
                  x: 20,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
                {
                  x: 50,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
              ],
              markerEnd: 'arrow',

            },
          ],
          labels: [
            {
              point: {
                x: 35,
                y: this.price(),
                xAxis: 0,
                yAxis: 0
              },
              text: 'this.equation1()'
            }
          ]
        }
      ]
    });

  }

  private _createSeries() {
    let x = 18, a = 120, b = 2, c = -13, d = 1.8;
    let demandSeries = [], supplySeries = [];

    let demand = (x: number): number => {
      return a - b * x;
    }

    let supply = (x: number): number => {
      return c + d * x;
    }
    let qd = (y: number) => { return (a - y) / b; }
    let qs = (y: number) => { return (y - c) / d; }

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

    } while (x <= 57);

    let eqX = (a - c) / (b + d);

    let eqSeries = [
      { x: 0, y: demand(eqX), accessibility: { enabled: false } },
      { name: 'Equilibrium:', x: eqX, y: demand(eqX), marker: { enabled: true } },
      { x: eqX, y: 9, accessibility: { enabled: false } }
    ];

    let eqRef = [
      { x: 0, y: demand(eqX), accessibility: { enabled: false } },
      { name: 'Initial equilibrium:', x: eqX, y: demand(eqX), marker: { enabled: true } },
      { x: eqX, y: 9, accessibility: { enabled: false } }
    ]

    let qsSeries = [
      { x: 10, y: this.price(), accessibility: { enabled: false } },
      { name: 'q<sup>s</sup>:', x: qs(this.price()), y: this.price(), marker: { enabled: true } },
      { x: qs(this.price()), y: 10, accessibility: { enabled: false } }
    ],
      qdSeries = [
        { x: 10, y: this.price(), accessibility: { enabled: false } },
        { name: 'q<sup>d</sup>:', x: qd(this.price()), y: this.price(), marker: { enabled: true } },
        { x: qd(this.price()), y: 10, accessibility: { enabled: false } }
      ];

    return {
      demand: demandSeries,
      supply: supplySeries,
      EQ: eqSeries,
      EQref: eqRef,
      QD: qd(this.price()),
      QS: qs(this.price()),
      QSseries: qsSeries,
      QDseries: qdSeries
    }

  }

  private _labelPositioner() {

  }

}
