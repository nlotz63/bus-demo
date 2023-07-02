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
import { single } from 'rxjs';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive5',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive5.component.html',
  styleUrls: ['./interactive5.component.scss'],
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
export class Interactive5Component implements OnInit, AfterViewInit {

  graphTitle: string = 'Market for Cheese';
  xGood = computed(() => {
    if (this.mode() === 0) {
      return 'cheese';
    } else {
      return 'apartments';
    }
  });
  chart1!: Highcharts.Chart;

  mode = signal(0);
  price = signal(50);


  constructor(private el: ElementRef, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this._setupStep();
  }


  // Private methods
  private _setupStep() {
    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart1 = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The market for oil in equilibrium. The supply and demand curves intersect at the market-clearing price of $50 per barrel and quantity of 35 billion barrels per year.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.graphTitle}`,
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

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood()} boxes ` },
        min: 15,
        max: 55,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Cost (price) per cheese box` },
        min: 10,
        max: 90,
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

}
