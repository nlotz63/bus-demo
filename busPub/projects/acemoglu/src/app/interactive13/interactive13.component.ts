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
import { BusPubLibModule } from 'bus-pub-lib';
import { ModelService, EconModel } from 'projects/poe-app/src/app/model.service';
import { MatRadioModule } from '@angular/material/radio';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);


@Component({
  selector: 'app-interactive13',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatRadioModule],
  templateUrl: './interactive13.component.html',
  styleUrls: ['./interactive13.component.scss'],
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
export class Interactive13Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  mode = signal(0);
  quantity = signal(0);
  price = signal(3);
  revenueSeries: any[] = [];
  series!: any;

  graph = signal(
    {
      xGood: 'Quantity (in millions of pills)',
      yGood: 'Price and cost (dollars per pill)',
      title: 'Market for Claritin',
      caption: 'The market for Claritin in equilibrium. Price and cost per pill shown on the left axis. Total revenue is shown on the right axis.',
      xMin: 0,
      xMax: 1300,
      yMin: 0,
      yMax: 7,
      xscale: 12,
      yscale: .1
    }
  );
  keyValues: any = {
    yscale: .1,
    xscale: 10
  }

  modelParams: Signal<EconModel> = computed(() => {
    return {
      xMin: 0,
      xMax: 100,
      xStep: 10,
      xscale: this.graph().xscale,
      yscale: this.graph().yscale,
      demandIntercept: 60,
      demandSlope: .6,
      c0: 0,
      c1: 10
    }
  });



  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this._setupGraph();
    
  }

  public updateGraph() {
    let series = this.series;
    let startQty = series.QD(2);
    let p0 = this.mode() === 0 ? 4 : 2, p1 = this.mode() === 1 ? 3 : 2;
    let q0 = series.QD(p0), q1 = series.QD(p1);

    let p0Series = [
      { x: 0, y: p0},
      { x: q0, y: p0, marker: { enabled: true } },
      { x: q0, y: 0 }
    ];

    this.chart1.series[3].setData(p0Series, true, false, false);

  }


  private _setupGraph() {
    const container = this.el.nativeElement.querySelector('#chart1');
    this.series = this.modelService.monopolyModel(this.modelParams());
    let series = this.series;

    let startPoint = [
      { x: 0, y: 3 },
      { x: series.QD(3), y: 3, marker: { enabled: true } },
      { x: series.QD(3), y: 0}
    ]
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
          name: 'Demand',
          lineWidth: 2,
          zIndex: 0,

          data: series.demand
        },
        {
          type: 'line',
          name: 'MR',
          lineWidth: 2,
          zIndex: 0,

          data: series.MR
        },
        {
          type: 'line',
          name: 'Mid-point',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 1,
          data: startPoint,
          label: { enabled: false },
          marker: {
            radius: 3,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'line',
          name: 'Start price',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 1,
          data: [],
          label: { enabled: false },
          marker: {
            radius: 3,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'arearange',
          name: 'Price effect',
          data: []
        },
        {
          type: 'arearange',
          name: 'Quantity effect',
          data: []
        }



      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xGood}` },
        min: this.graph().xMin,
        max: this.graph().xMax,
        tickInterval: 200
      },
      yAxis: [{
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yGood}` },
        min: this.graph().yMin,
        max: this.graph().yMax,
        tickInterval: 1
      },
    ],
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}: </b> ',
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.0f}`
          },
          label: { useHTML: true, enabled: true, style: { fontSize: '.75em' } }
        }
      },
    });
    this.updateGraph();
  }
}
