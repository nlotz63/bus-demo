import { Component, OnInit, AfterViewInit, Input, signal } from '@angular/core';
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
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusPubLibModule } from 'bus-pub-lib';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive04',
  standalone: true,
  imports: [CommonModule, BusPubLibModule],
  templateUrl: './interactive04.component.html',
  styleUrls: ['./interactive04.component.scss'],
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

export class Interactive04Component implements OnInit, AfterViewInit {

  @Input() mode?: string | number;
  chart?: Highcharts.Chart;

  title: string = 'Cost Curves';
  xGood: string = 'cheese';
  graphTitle: string = 'Wisconsin Cheeseman';
  qStar: number = 602;
  pStar: number = 1.07;
  atcStar: number = 1.07;
  profit: number = 0;


  sliderGroup = new FormGroup({
    variable: new FormControl(0),
    fixed: new FormControl(0),
    quantity: new FormControl(602),
    price: new FormControl(1.07)

  });



  constructor(private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    if (this.mode) {
      this.mode = +this.mode;
    } else { this.mode = 0; }

    switch (this.mode) {
      case 0:
        this.title = 'Cost Curves of a Firm';
        break;
      case 1:
        this.title = 'A Firm\'s Costs and the Effect of Price on Profit';
        break;
      default:
        this.title = 'A Firm\'s Profit Maximizing Output';
        break;
    }

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      },

    });

  }

  ngAfterViewInit(): void {
    this._setupStep();

  }

  public playStep() {

  }

  public updateGraph() {
    let series = this._createSeries();

    switch (this.mode) {
      case 0:
        this.chart?.series[0].setData(series.ATC, false, false, false);
        this.chart?.series[1].setData(series.MC, false, false, false);
        this.chart?.series[2].setData(series.AVC, true, false, false);
        break;
      case 1:
        this.chart?.series[3].setData(series.MR, true, false, false);
        this.chart?.series[4].setData(series.profit, true, false, false);

        break;
      case 2:
        this.chart?.series[4].setData(series.profit, true, false, false);
        this.chart?.series[5].setData(series.qStar, true, false, false);
        this.chart?.update(
          {
            annotations: [
              {
                labels: [{
                  point: {
                    xAxis: 0,
                    yAxis: 0,
                    x: series.qStar[0].x,
                    y: .4
                  },
                  text: `MR =  $${series.qStar[3].y.toFixed(2)}<br/>MC = $${series.qStar[2].y.toFixed(2)}<br/>ATC = $${series.qStar[1].y.toFixed(2)}`,
                  accessibility: {
                    description: `MR equals ${series.qStar[3].y.toFixed(2)} dollars. MC equals ${series.qStar[2].y.toFixed(2)} dollars. ATC equals ${series.qStar[1].y.toFixed(2)} dollars.`
                  }
    
                }
                ],
              }
            ]
          }
        );
        break;

      default:
        break;
    }

  }

  private _setupStep() {
    if (this.mode === 2) this.sliderGroup.patchValue({ price: 1.25 });
    let series = this._createSeries();
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The Wisconsin Cheeseman is a producer of cheese boxes. The graph shows the firm’s cost curves and its demand curve. Per unit costs and market price are shown on the y-axis and the quantity produced is shown on the x-axis.`
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
          valueDescriptionFormat: `quantity: {point.x:.0f}, price: {point.y:.0f} dollars.`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'spline',
          name: 'ATC',
          color: '#37723B',
          lineWidth: 2,
          data: series.ATC,
        },
        {
          type: 'spline',
          name: 'MC',
          color: '#C63F43',
          lineWidth: 2,
          data: series.MC
        },
        {
          type: 'spline',
          name: 'AVC',
          color: '#563177',
          lineWidth: 2,
          data: series.AVC
        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `Quantity of ${this.xGood} boxes ` },
        min: 0,
        max: 2000,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Cost (price) per cheese box` },
        min: .5,
        max: 1.5,
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `\${point.y:,.2f}`
          },
          label: {enabled: true}
        }
      },
    });

    switch (this.mode) {
      case 0:
        this.chart.addSeries(
          {
            type: 'spline',
            name: 'Initial ATC',
            color: 'rgb(125, 125, 125)',
            zIndex: -1,
            lineWidth: 1,
            dashStyle: 'LongDash',
            data: series.ATC,
            label: {enabled: false}
          },
          false
        );
        this.chart.addSeries(
          {
            type: 'spline',
            name: 'Initial MC',
            color: 'rgb(125, 125, 125)',
            lineWidth: 1,
            zIndex: -1,
            dashStyle: 'LongDash',
            data: series.MC,
            label: {enabled: false}
          },
          false
        );
        this.chart.addSeries(
          {
            type: 'spline',
            name: 'Initial AVC',
            color: 'rgb(125, 125, 125)',
            lineWidth: 1,
            zIndex: -1,
            dashStyle: 'LongDash',
            data: series.AVC,
            label: {enabled: false}
          },
          true
        );
        break;
      case 1:
        this.chart.addSeries({
          type: 'line',
          name: 'Price = MR',
          lineWidth: 2,
          zIndex: 1,
          color: '#0771BD',
          data: series.MR

        });
        this.chart.addSeries({
          type: 'arearange',
          name: 'profit/loss',
          opacity: .5,
          zIndex: -1,
          data: series.profit
        });
        break;
      case 2:
        case 1:
          this.chart.addSeries({
            type: 'line',
            name: 'Price = MR',
            lineWidth: 2,
            zIndex: 1,
            color: '#0771BD',
            data: series.MR
  
          });
          this.chart.addSeries({
            type: 'arearange',
            name: 'profit/loss',
            opacity: .5,
            zIndex: -1,
            data: series.profit,
            enableMouseTracking: false

          });
        this.chart.addSeries({
          type: 'line',
          lineWidth: 1,
          zIndex: 2,
          color: 'black',
          data: series.qStar,
          marker: { enabled: true, radius: 4, symbol: 'circle', lineWidth: 1, lineColor: 'black', fillColor: 'lightgrey' },
          label: { enabled: false },
          tooltip: {
            headerFormat: 'Selected quantity: ',
            pointFormat: `{point.x}`,
            valueDecimals: 2
          }
        });
        this.chart.addAnnotation(
          {
            animation: false,
            labelOptions: {
              backgroundColor: 'rgba(255, 255, 255, 0)',
              borderWidth: 0,
              align: 'left',
              verticalAlign: 'bottom',
              x: 5,
              y: -2,
              style: {
                textAlign: 'right',
                fontSize: '12px'
              },
            },
            labels: [{
              useHTML: true,
              point: {
                xAxis: 0,
                yAxis: 0,
                x: series.qStar[0].x,
                y: .4
              },
              text: `MR =  $${series.qStar[3].y.toFixed(2)}<br/>MC = $${series.qStar[2].y.toFixed(2)}<br/>ATC = $${series.qStar[1].y.toFixed(2)}`,
              accessibility: {
                description: `MR equals ${series.qStar[3].y.toFixed(2)} dollars. MC equals ${series.qStar[2].y.toFixed(2)} dollars. ATC equals ${series.qStar[1].y.toFixed(2)} dollars.`
              }

            }
            ],
          }
        );
          break;

      default:
        break;
    }

  }

  private _createSeries() {
    let slider = this.sliderGroup.value;
    let p = slider.price!, q = slider.quantity!;

    let a = .000000004, b = 0.000004, c = 0.0101, d = 0.0217;
    let scalar01 = 85 + slider.variable!, FC = 216 + slider.fixed!;

    let x = 50, atcArr: any[] = [], avcArr: any[] = [], mcArr: any[] = [];

    let vc = (x: number) => scalar01 * (a * Math.pow(x, 3) - b * Math.pow(x, 2) + c * x + d);
    let mc = (x: number) => scalar01 * (3 * a * Math.pow(x, 2) - 2 * b * x + c);

    let inverseMC = (x: any) => (b*scalar01 + Math.sqrt(Math.pow(b, 2)*Math.pow(scalar01, 2) - 3*a*c*Math.pow(scalar01, 2)+ 3*a*scalar01*x))/(3*a*scalar01);

    do {
      let point = {
        x: x,
        y: vc(x) / x
      }
      let point2 = {
        x: x,
        y: mc(x)
      };
      let point3 = {
        x: x,
        y: vc(x) / x + FC / x
      }
      avcArr.push(point);
      mcArr.push(point2);
      atcArr.push(point3);
      x = x + 50;


    } while (x <= 1750);

    // price and marginal revenue series
    let mrSeries = [
      {
        name: 'price',
        x: 0,
        y: p,
      },
      {
        name: 'price',
        x: 1900,
        y: p
      }

    ];

    // profit area
    let xStar = this.mode === 1 ? inverseMC(p) : q, atc = vc(xStar) / xStar + FC / xStar;

    let profitSeries = [
      {
        name: p < atc ? 'Loss' : 'Profit',
        x: 0,
        low: p! < atc ? p : atc,
        high: p! <= atc ? atc : p,
      },
      {
        x: xStar,
        low: p < atc ? p : atc,
        high: p <= atc ? atc : p
      }
    ];

    let quantStarSeries = [
      {
        x: xStar,
        y: 0.4,
        marker: { enabled: false },
      },
      {
        x: xStar,
        y: atc,
        name: 'ATC',
      },
      {
        x: xStar,
        y: mc(xStar),
        name: 'MC'
      },
      {
        x: xStar,
        y: p,
        name: 'MR'
      }
    ];
    this.qStar = xStar;
    this.pStar = p;
    this.atcStar = atc;
    this.profit = (Number(p.toFixed(3)) - Number(atc.toFixed(3))) * Number(xStar.toFixed(3));

    return {
      AVC: avcArr,
      MC: mcArr,
      ATC: atcArr,
      MR: mrSeries,
      profit: profitSeries,
      qStar: quantStarSeries
    }

  }


}
