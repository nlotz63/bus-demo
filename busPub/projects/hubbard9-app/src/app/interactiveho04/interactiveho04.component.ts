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
import { BusPubLibModule } from 'bus-pub-lib';
import { MatRadioModule } from '@angular/material/radio';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactiveho04',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, CurrencyPipe, MatRadioModule],
  templateUrl: './interactiveho04.component.html',
  styleUrls: ['./interactiveho04.component.scss'],
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
export class Interactiveho04Component implements OnInit, AfterViewInit {

  chart!: Highcharts.Chart;
  currencyFormat = new CurrencyPipe('en-US', 'USD');
  cs0Area = signal('A');
  cs1Area = signal('A');

  // signals
  mode = signal(0);
  initialPrice = signal(2);
  newPrice = signal(2);

  controls = computed(() => {
    return {
      initPmin: this.mode() === 0 ? 1 : 1,
      initPmax: this.mode() === 0 ? 5 : 3,
      newPmin: this.mode() === 0 ? .5 : .5,
      newPmax: this.mode() === 0 ? 6 : 3.5,
    }
  });

  graph = computed(() => {

    if (this.mode() === 0) {

      return {
        title: `Demand for Chai Tea`,
        caption: `The market demand curve for jeans. The initial consumer surplus (CS<sub>0</sub>) is the area ${this.cs0Area()}. The new consumer surplus (CS<sub>1</sub>) is the area ${this.cs1Area()}.`,
        xMax: 24,
        yMax: 12,
        nameCurve: `D<sub>Market</sub>`,
        descriptionCurve: 'A straight line that slopes down from left to right.',
        colorCurve: '#0166B3',
        colorInit: '#BACDE9',
        descriptionA: 'The area under the demand curve above the initial price.',
        descriptionBC: `The area between the initial price, the new price and the demand curve.`


      }

    } else {
      return {
        title: `Supply of Chai Tea`,
        caption: `The market supply curve for jeans. The initial producer surplus (PS<sub>0</sub>) is the area ${this.cs1Area()}. The new producer surplus (PS<sub>1</sub>) is the area ${this.cs0Area()}.`,
        xMax: 35,
        yMax: 5,
        nameCurve: `S<sub>Market</sub>`,
        descriptionCurve: 'A straight line that slopes upward from left to right.',
        colorCurve: '#B0092C',
        colorInit: '#DDB4B3',
        descriptionA: 'The area above the supply curve below the initial price.',
        descriptionBC: `The area between the initial price, the new price and the supply curve.`

      }
    }
  });

  equations = signal({
    one: ``,
    two: ``,
    three: ``
  })


  constructor(private announcer: LiveAnnouncer, private el: ElementRef) { }

  ngOnInit(): void {
    this._setupGraph();
  }

  ngAfterViewInit(): void {
  }

  public updateGraph() {
    let series = this._createSeries();
    let cs1Description = this.initialPrice() >= this.newPrice() ? 'initial price' : 'new price';

    if (this.initialPrice() > this.newPrice()) {
      this.cs1Area.set('A + B + C');
      this.cs0Area.set('A');
    } else if (this.initialPrice() < this.newPrice()) {
      this.cs1Area.set('A');
      this.cs0Area.set('A + B + C');
    } else {
      this.cs0Area.set('A');
      this.cs1Area.set('A');
    }

    this.chart.update({
      caption: {
        text: this.graph().caption,
        useHTML: true
      },
      series: [
        {
          type: 'line',
          data: this.mode() === 0 ? series.demand : series.supply
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
          data: this.mode() === 0 ? series.CS1 : series.PS1,
          accessibility: {
            description: `The area under the demand curve above the ${cs1Description}.`
          }
        },
        {
          type: 'arearange',
          data: this.mode() === 0 ? series.CS2 : series.PS2,
        },
        {
          type: 'line',
          data: this.mode() === 0 ? [] : series.connector,
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
          visible: this.initialPrice() !== this.newPrice() ? true : false,
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

  public _setupGraph() {
    this.newPrice.set(2), this.initialPrice.set(2);
    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        useHTML: true,
        text: this.graph().caption
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: this.graph().title,
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      tooltip: { useHTML: true, enabled: true },
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
          name: this.graph().nameCurve,
          lineWidth: 2,
          zIndex: 1,
          color: this.graph().colorCurve,
          data: this.mode() === 0 ? series.demand : series.supply,
          label: {
            useHTML: true,
            enabled: true
          },
          accessibility: {
            description: this.graph().descriptionCurve
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
          label: { enabled: false }
        },
        {
          type: 'line',
          name: 'New price',
          dashStyle: 'ShortDash',
          lineWidth: 1.5,
          zIndex: 2,
          color: 'black',
          data: series.newPrice,
          label: { enabled: false }
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Area A',
          opacity: .75,
          color: this.graph().colorInit,
          zIndex: -1,
          data: this.mode() === 0 ? series.CS1 : series.PS1,
          accessibility: {
            description: this.graph().descriptionA
          }
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Area B + C',
          color: 'salmon',
          opacity: .4,
          zIndex: -1,
          data: this.mode() === 0 ? series.CS2 : series.PS2,
          accessibility: {
            description: this.graph().descriptionBC
          }
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          name: '',
          lineWidth: 1.5,
          zIndex: -1,
          color: 'black',
          data: series.connector,
          label: { enabled: false }
        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity (thousands of cups  per day)` },
        min: 0,
        max: this.graph().xMax,
        tickInterval: 5
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Price (dollars per cup)` },
        min: 0,
        max: this.graph().yMax,
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `\${point.y:.2f}`
          },
          label: { enabled: false }
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

  private _createSeries() {

    let a = 10, b = .535, c = 0, d = .133, x = 0;
    let initP = this.initialPrice(), newP = this.newPrice();

    let f = (x: number) => { return a - b * x; }, inverse = (x: number) => a / b - x / b;
    let s = (x: number) => { return c + d * x; }, inverseS = (x: number) => -c / d + x / d;
    let demand: any[] = [], supply: any[] = [], cs1: any[] = [], cs2: any[] = [];

    do {
      let point = {
        x: x,
        y: f(x)
      }
      let point1 = {
        x: x,
        y: s(x)
      }
      demand.push(point);
      supply.push(point1);
      x = x + .5;

    } while (x <= 30);

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
    ];

    const ps1 = [
      {
        x: 0,
        high: newP > initP ? initP : newP,
        low: s(0)
      },
      {
        x: newP > initP ? inverseS(initP) : inverseS(newP),
        low: newP > initP ? initP : newP,
        high: newP > initP ? initP : newP
      }
    ],

      ps2 = [
        {
          x: 0,
          low: newP > initP ? newP : initP,
          high: newP > initP ? initP : newP
        },
        {
          x: newP > initP ? inverseS(initP) : inverseS(newP),
          low: newP > initP ? newP : initP,
          high: newP > initP ? initP : newP
        },
        {
          x: newP > initP ? inverseS(newP) : inverseS(initP),
          low: newP > initP ? newP : initP,
          high: newP > initP ? newP : initP
        }
      ];

    let connector = newP <= initP ? [{ x: inverseS(newP), y: newP }, { x: inverseS(newP), y: initP }] : [{ x: inverseS(initP), y: initP }, { x: inverseS(initP), y: newP }];



    let initPrice = [
      { x: 0, y: initP, accessibility: { enabled: false } },
      {
        x: this.mode() === 0 ? inverse(initP) : inverseS(initP), y: initP,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          fillColor: '#FCFBF2',
          lineWidth: 1,
          lineColor: 'black'
        }
      },
      { x: this.mode() === 0 ? inverse(initP) : inverseS(initP), y: 0, accessibility: { enabled: false } },
    ];
    let newPrice = [
      { x: 0, y: newP, accessibility: { enabled: false } },
      {
        x: this.mode() === 0 ? inverse(newP) : inverseS(newP), y: newP,
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
          fillColor: '#FCFBF2',
          lineWidth: 1,
          lineColor: 'black'
        }
      },
      { x: this.mode() === 0 ? inverse(newP) : inverseS(newP), y: 0, accessibility: { enabled: false } },
    ];
    // dynamic equations
    let cs0 = ((f(0) - initP) * inverse(initP)) / 2, csNew = ((f(0) - newP) * inverse(newP)) / 2, csDif = csNew - cs0;
    let ps0 = ((initP - s(0)) * inverse(initP)) / 2, psNew = ((newP - s(0)) * inverse(newP)) / 2, psDif = psNew - ps0;

    this.equations().one = this.mode() === 0 ? `$$ CS_0 = \\frac{(\$${f(0)}- ${this.currencyFormat.transform(initP)}) \\times (${inverse(initP).toFixed(1)}-0)} {2} = ${this.currencyFormat.transform(cs0)} $$` : `$$ PS_0 = \\frac{(\$${initP.toFixed(2)} - \$${s(0)}) \\times (${inverseS(initP).toFixed(1)}-0)} {2} = ${this.currencyFormat.transform(ps0)} $$`;

    this.equations().two = this.mode() === 0 ? `$$ CS_1 = \\frac{(\$${f(0)}- \$${newP.toFixed(2)}) \\times (${inverse(newP).toFixed(1)}-0)} {2} = ${this.currencyFormat.transform(csNew)} $$` : `$$ PS_1 = \\frac{(\$${newP.toFixed(2)} - \$${s(0)}) \\times (${inverseS(newP).toFixed(1)}-0)} {2} = ${this.currencyFormat.transform(psNew)} $$`;

    this.equations().three = this.mode() === 0 ? `$$\\Delta CS = CS_1 - CS_0 = ${this.currencyFormat.transform(csDif)} \\text{ thousand} $$` : `$$\\Delta PS = PS_1 - PS_0 = ${this.currencyFormat.transform(psDif)} \\text{ thousand} $$`;

    let labelPosition = this.mode() === 0 ? this._positioner(initP, newP, inverse(initP), inverse(newP)) : this._positioner(initP, newP, inverseS(initP), inverseS(newP));

    return {
      demand: demand,
      supply: supply,
      initialPrice: initPrice,
      newPrice: newPrice,
      CS1: cs1,
      CS2: cs2,
      PS1: ps1,
      PS2: ps2,
      labelPositioner: labelPosition,
      connector: connector
    }
  }

  private _positioner(initP: number, newP: number, initQ: number, newQ: number) {
    let xcsA: number = 0, xcsB: number = 0, xcsC: number = 0;
    let ycsA: number = 0, ycsB: number = 0, ycsC: number = 0;

    switch (this.mode()) {
      case 0:
        if (initP < newP) {
          xcsA = newQ / 2;
          xcsB = newQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = newP + .5;
          ycsB = initP + .1;
          ycsC = initP + .1;
    
        } else if (initP > newP) {
          xcsA = initQ / 2;
          xcsB = initQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = initP + .5;
          ycsB = newP + .1;
          ycsC = newP + .1;
    
        } else {
          xcsA = newQ / 2;
          xcsB = newQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = newP + .5;
          ycsB = initP + .1;
          ycsC = initP + .1;
    
        }
    
        break;
      case 1:
        if (initP > newP) {
          xcsA = newQ / 2;
          xcsB = newQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = newP - .5;
          ycsB = initP - .25;
          ycsC = initP - .25;

        } else if (initP < newP) {
          xcsA = initQ / 2;
          xcsB = initQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = initP - .5;
          ycsB = newP - .25;
          ycsC = newP - .25;

        } else {
          xcsA = newQ / 2;
          xcsB = newQ / 2;
          xcsC = (initQ + newQ) / 2;
          ycsA = newP - .5;
          ycsB = initP - .25;
          ycsC = initP - .25;

        }

        break;

      default:
        break;
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
