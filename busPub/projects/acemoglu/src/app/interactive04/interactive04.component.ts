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
  graphTitle: string = 'Cheeseman'

  sliderGroup = new FormGroup({
    variable: new FormControl(0),
    fixed: new FormControl(0),
    quantity: new FormControl(0),
    price: new FormControl(0)

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

      default:
        break;
    }

  }

  private _setupStep() {
    let series = this._createSeries();
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The market demand curve for ${this.xGood} with a shaded triangle showing the consumer surplus at the initial price of $50.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.graphTitle}'s Cost Curves`,
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
          data: series.ATC
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
        title: { useHTML: true, text: `Quantity of ${this.xGood} ` },
        min: 0,
        max: 2000,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `Price per pair` },
        min: .5,
        max: 1.5,
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `\${point.y:.2f}`
          },
          label: {enabled: true}
        }
      },


    });

  }

  private _createSeries() {
    let slider = this.sliderGroup.value;
    let p = slider.price, q = slider.quantity;

    let a = .000000004, b = 0.000004, c = 0.0101, d = 0.0217;
    let scalar01 = 85 + slider.variable!, FC = 216 + slider.fixed!;

    let x = 50, atcArr: any[] = [], avcArr: any[] = [], mcArr: any[] = [];

    let vc = (x: number) => scalar01 * (a * Math.pow(x, 3) - b * Math.pow(x, 2) + c * x + d);
    let mc = (x: number) => scalar01 * (3 * a * Math.pow(x, 2) - 2 * b * x + c);

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


    return {
      AVC: avcArr,
      MC: mcArr,
      ATC: atcArr
    }

  }


}
