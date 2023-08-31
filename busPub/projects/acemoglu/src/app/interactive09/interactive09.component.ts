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
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusPubLibModule } from 'bus-pub-lib';
import { NodeWithI18n } from '@angular/compiler';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive09',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, ReactiveFormsModule, CurrencyPipe ],
  templateUrl: './interactive09.component.html',
  styleUrls: ['./interactive09.component.scss'],
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
export class Interactive09Component implements OnInit, AfterViewInit {
  chart!: Highcharts.Chart;
  xGood: string = 'Jeans';
  equation1 = ``;
  equation2 = ``;
  equation3 = ``;
  currencyFormat = new CurrencyPipe('en-US');
  ps0Area = 'A';
  ps1Area = 'A';

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
        text: `The market supply curve for ${this.xGood} with a shaded triangle showing the producer surplus at the initial price of $50.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `Supply of ${this.xGood}`,
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
          name: 'S<sub>Market</sub>',
          lineWidth: 2,
          zIndex: 1,
          color: '#C62828',
          data: series.demand,
          label: {
            useHTML: true,
            enabled: true
          },
          accessibility: {
            description: 'A straight line that slopes upward from left to right.'
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
          data: series.PS1,
          accessibility: {
            description: `The area above the supply curve below the initial price.`
          }
        },
        {
          type: 'arearange',
          animation: false,
          name: 'Area B + C',
          color: 'salmon',
          opacity: .4,
          zIndex: -1,
          data: series.PS2,
          accessibility: {
            description: `The area between the initial price, the new price and the supply curve.`
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
          label: {enabled: false}
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood} ` },
        min: 0,
        max: 90,
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
        max: 85,
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
                x: series.labelPositioner.xPSA,
                y: series.labelPositioner.yPSA
              },
              text: 'A'
            }
          ]
        },
        {
          id: 'ps1',
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
                x: series.labelPositioner.xPSB,
                y: series.labelPositioner.yPSB
              },
              text: 'B'
            },
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xPSC,
                y: series.labelPositioner.yPSC
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
    let ps1Description = slider.initialPrice! >= slider.newPrice! ? 'initial price' : 'new price';

    if (slider.initialPrice! < slider.newPrice!) {
      this.ps1Area = 'A + B + C';
      this.ps0Area = 'A';
    } else if (slider.initialPrice! > slider.newPrice!) {
      this.ps1Area = 'A';
      this.ps0Area = 'A + B + C';
    } else {
      this.ps0Area = 'A';
      this.ps1Area = 'A';
    }
    let caption = `The market supply curve for jeans. The initial producer surplus (PS<sub>0</sub>) is the area ${this.ps0Area}. The new producer surplus (PS<sub>1</sub>) is the area ${this.ps1Area}.
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
          data: series.PS1,
          accessibility: {
            description: `The area under the demand curve above the ${ps1Description}.`
          }
        },
        {
          type: 'arearange',
          data: series.PS2
        },
        {
          type: 'line',
          data: series.connector,
        },

      ],
      annotations: [
        {
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xPSA,
                y: series.labelPositioner.yPSA
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
                x: series.labelPositioner.xPSB,
                y: series.labelPositioner.yPSB
              },
              text: 'B'
            },
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.labelPositioner.xPSC,
                y: series.labelPositioner.yPSC
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

    let a = 10, b = .8, x = 0;
    let initP = this.sliderGroup.value.initialPrice!, newP = this.sliderGroup.value.newPrice!;

    let f = (x: number) => { return a + b * x; }, inverse = (x: number) => -a / b + x / b;

    let demand: any[] = [], ps1: any[] = [], ps2: any[] = [];

    do {
      let point = {
        x: x,
        y: f(x)
      }
      demand.push(point);
      x = x + 10;

    } while (x <= 90);

    // area range series

    ps1 = [
      {
        x: 0,
        high: newP > initP ? initP : newP,
        low: f(0)
      },
      {
        x: newP > initP ? inverse(initP) : inverse(newP),
        low: newP > initP ? initP : newP,
        high: newP > initP ? initP : newP
      }
    ]

    ps2 = [
      {
        x: 0,
        low: newP > initP ? newP : initP,
        high: newP > initP ? initP : newP
      },
      {
        x: newP > initP ? inverse(initP) : inverse(newP),
        low: newP > initP ? newP : initP,
        high: newP > initP ? initP : newP
      },
      {
        x: newP > initP ? inverse(newP) : inverse(initP),
        low: newP > initP ? newP : initP,
        high: newP > initP ? newP : initP
      }
    ]
    let connector = newP <= initP ? [{ x: inverse(newP), y: newP }, { x: inverse(newP), y: initP }] : [{ x: inverse(initP), y: initP }, { x: inverse(initP), y: newP}];

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
    let ps0 = ((initP - f(0)) * inverse(initP)) / 2, psNew = ((newP - f(0)) * inverse(newP)) / 2, psDif = psNew - ps0;

    this.equation1 = `$$ PS_0 = \\frac{(\$${initP} - \$${f(0)}) \\times (${inverse(initP)}-0)} {2} = ${this.currencyFormat.transform(ps0) } $$`;
    this.equation2 = `$$ PS_1 = \\frac{(\$${newP} - \$${f(0)}) \\times (${inverse(newP)}-0)} {2} = ${ this.currencyFormat.transform(psNew)} $$`;
    this.equation3 = `$$\\text{Change in producer surplus} = PS_1 - PS_0 = ${this.currencyFormat.transform(psDif)} $$`;

    let labelPosition = this._positioner(initP, newP, inverse(initP), inverse(newP));

    return {
      demand: demand,
      initialPrice: initPrice,
      newPrice: newPrice,
      PS1: ps1,
      PS2: ps2,
      connector: connector,
      labelPositioner: labelPosition
    }
  }

  private _positioner(initP: number, newP: number, initQ: number, newQ: number) {
    let xpsA: number = 0, xpsB: number = 0, xpsC: number = 0;
    let ypsA: number = 0, ypsB: number = 0, ypsC: number = 0;

    if (initP > newP) {
      xpsA = newQ / 2;
      xpsB = newQ / 2;
      xpsC = (initQ + newQ) / 2;
      ypsA = newP - 8;
      ypsB = initP - 4;
      ypsC = initP - 4;

    } else if (initP < newP) {
      xpsA = initQ / 2;
      xpsB = initQ / 2;
      xpsC = (initQ + newQ) / 2;
      ypsA = initP - 8;
      ypsB = newP - 4;
      ypsC = newP - 4;

    } else {
      xpsA = newQ / 2;
      xpsB = newQ / 2;
      xpsC = (initQ + newQ) / 2;
      ypsA = newP - 8;
      ypsB = initP - 4;
      ypsC = initP - 4;

    }

    return {
      xPSA: xpsA,
      xPSB: xpsB,
      xPSC: xpsC,
      yPSA: ypsA,
      yPSB: ypsB,
      yPSC: ypsC

    }
  }

}
