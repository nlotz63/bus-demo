import { AfterViewInit, Component, OnInit, signal, computed, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, BusPubLibModule, ReactiveFormsModule, CurrencyPipe ],
  templateUrl: './interactive03.component.html',
  styleUrls: ['./interactive03.component.scss'],
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
export class Interactive03Component implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;
  xGood: string = 'Jeans';
  equation1 = ``;
  equation2 = ``;
  equation3 = ``;
  currencyFormat = new CurrencyPipe('en-US');
  cs0Area = 'A';
  cs1Area = 'A';

  sliderGroup = new FormGroup({
    initialPrice: new FormControl(50),
    newPrice: new FormControl(50)
  });



  constructor(private announcer: LiveAnnouncer, private el: ElementRef) { }

  ngOnInit(): void {
    this._createSeries();

  }

  ngAfterViewInit(): void {

    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');

    this.chart = new Highcharts.Chart( container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        useHTML: true,
        text: `The market demand curve for ${this.xGood} with a shaded triangle showing the consumer surplus at the initial price of $50.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `Demand for ${this.xGood}`,
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
          valueDescriptionFormat: `quantity: {point.x:.0f}, price: {point.y:.0f} dollars.`
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
            useHTML: true,
            enabled: true
          },
          accessibility: {
            description: 'A straight line that slopes down from left to right.'
          }
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          name: 'Initial price',
          lineWidth: 1.5,
          zIndex: 2,
          color: 'black',
          data: series.initialPrice,
          label: {enabled: false}
        },
        {
          type: 'line',
          name: 'New price',
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
          name: 'Area A',
          opacity: .5,
          zIndex: -1,
          data: series.CS1,
          accessibility: {
            description: `The area under the demand curve above the initial price.`
          }
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Area B + C',
          color: 'salmon',
          opacity: .4,
          zIndex: -1,
          data: series.CS2,
          accessibility: {
            description: `The area between the initial price, the new price and the demand curve.`
          }
        }

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood} ` },
        min: 0,
        max: 100,
        tickInterval: 10
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Price per pair` },
        min: 0,
        max: 140,
        tickInterval: 10,
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `\${point.y:.2f}`
          },
          label: {enabled: false}
        }
      },
      annotations: [
        {
          labelOptions: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            align: 'right',
            verticalAlign: 'top'
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSA,
                y: series.labelPositioner.yCSA
              },
              text: 'A'
            }
          ]
        },
        {
          id: 'cs1',
          visible: false,
          labelOptions: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            align: 'right',
            verticalAlign: 'top'
          },
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSB,
                y: series.labelPositioner.yCSB
              },
              text: 'B'
            },
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSC,
                y: series.labelPositioner.yCSC
              },
              text: 'C'
            }

          ]
        }
      ]
    });

  }

  public updateGraph() {
    let series = this._createSeries();
    let slider = this.sliderGroup.value;
    let cs1Description = slider.initialPrice! >= slider.newPrice! ? 'initial price' : 'new price';

    if (slider.initialPrice! > slider.newPrice!) {
      this.cs1Area = 'A + B + C';
      this.cs0Area = 'A';
    } else if (slider.initialPrice! < slider.newPrice!) {
      this.cs1Area = 'A';
      this.cs0Area = 'A + B + C';
    } else {
      this.cs0Area = 'A';
      this.cs1Area = 'A';
    }
    let caption = `The market demand curve for jeans. The initial consumer surplus (CS<sub>0</sub>) is the area ${this.cs0Area}. The new consumer surplus (CS<sub>1</sub>) is the area ${this.cs1Area}.
    `;

    this.chart.update({
      caption: {
        text: caption,
        useHTML: true
      },
      series: [
        {
          type: 'line',
          data: series.demand
        },
        {
          type: 'line',
          data: series.initialPrice
        },
        {
          type: 'line',
          data: series.newPrice
        },
        {
          type: 'arearange',
          data: series.CS1,
          accessibility: {
            description: `The area under the demand curve above the ${cs1Description}.`
          }
        },
        {
          type: 'arearange',
          data: series.CS2
        },
      ],
      annotations: [
        {
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSA,
                y: series.labelPositioner.yCSA
              },
              text: 'A'
            }
          ]
        },
        {
          visible: slider.initialPrice! !== slider.newPrice! ? true : false,
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSB,
                y: series.labelPositioner.yCSB
              },
              text: 'B'
            },
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xCSC,
                y: series.labelPositioner.yCSC
              },
              text: 'C'
            }
          ]
        }
      ]
    }, true);
    this.announcer.announce('The graph has been updated');
  }

  private _createSeries() {

    let a = 125, b = 1.25, x = 0;
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
          fillColor: 'rgb(235, 235, 235)',
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
          fillColor: 'rgb(235, 235, 235)',
          lineWidth: 1,
          lineColor: 'black'
        }
      },
      { x: inverse(newP), y: 0, accessibility: { enabled: false } },
    ];
    let cs0 = ((f(0) - initP) * inverse(initP)) / 2, csNew = ((f(0) - newP) * inverse(newP)) / 2, csDif = csNew - cs0;

    this.equation1 = `$$ CS_0 = \\frac{(\$${f(0)}- \$${initP}) \\times (${inverse(initP)}-0)} {2} = ${this.currencyFormat.transform(cs0) } $$`;
    this.equation2 = `$$ CS_1 = \\frac{(\$${f(0)}- \$${newP}) \\times (${inverse(newP)}-0)} {2} = ${ this.currencyFormat.transform(csNew)} $$`;
    this.equation3 = `$$\\text{Change in consumer surplus} = CS_1 - CS_0 = ${this.currencyFormat.transform(csDif)} $$`;

    let labelPosition = this._positioner(initP, newP, inverse(initP), inverse(newP));

    return {
      demand: demand,
      initialPrice: initPrice,
      newPrice: newPrice,
      CS1: cs1,
      CS2: cs2,
      labelPositioner: labelPosition
    }
  }

  private _positioner(initP: number, newP: number, initQ: number, newQ: number) {
    let xcsA: number = 0, xcsB: number = 0, xcsC: number = 0;
    let ycsA: number = 0, ycsB: number = 0, ycsC: number = 0;

    if (initP < newP) {
      xcsA = newQ / 2;
      xcsB = newQ / 2;
      xcsC = (initQ + newQ) / 2;
      ycsA = newP + 5;
      ycsB = initP+1;
      ycsC = initP+1;

    } else if (initP > newP) {
      xcsA = initQ / 2;
      xcsB = initQ / 2;
      xcsC = (initQ + newQ) / 2;
      ycsA = initP + 5;
      ycsB = newP+1;
      ycsC = newP+1;

    } else {
      xcsA = newQ / 2;
      xcsB = newQ / 2;
      xcsC = (initQ + newQ) / 2;
      ycsA = newP + 5;
      ycsB = initP+1;
      ycsC = initP+1;

    }

    return {
      xCSA: xcsA,
      xCSB: xcsB,
      xCSC: xcsC,
      yCSA: ycsA,
      yCSB: ycsB,
      yCSC: ycsC

    }
  }

}
