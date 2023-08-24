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

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);


@Component({
  selector: 'app-interactive12',
  standalone: true,
  imports: [CommonModule, BusPubLibModule],
  templateUrl: './interactive12.component.html',
  styleUrls: ['./interactive12.component.scss'],
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
export class Interactive12Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  mode = signal(0);
  quantity = signal(0);
  revenueSeries: any[] = [];
  series!: any;

  graph = signal(
    {
      xGood: 'Quantity (in millions of pills)',
      yGood: 'Price and cost (dollars per pill)',
      title: 'Market for Claritin',
      caption: 'The market for Claritin in equilibrium. Price and cost per pill shown on the left axis. Total revenue is shown on the right axis.',
      xMin: 0,
      xMax: 1250,
      yMin: 0,
      yMax: 7,
      xscale: 12,
      yscale: .1
    }
  );
  keyValues = computed(() => {
    let series = this.series;
    let q = this.quantity();
    return {
      profit: q * (series.demFun(q).toFixed(2) - series.atcFun(q).toFixed(2)),
      price: series.demFun(q),
      ATC: series.atcFun(q),
      revenue: q * series.demFun(q).toFixed(2),
      eqSeries: [
        { x: 0, y: series.demFun(q) },
        { x: q, y: series.demFun(q), marker: { enabled: true } },
        { x: q, y: 0}
      ]
    }

  } );

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
      c1: -10.02,
      c2: 0
    }
  });



  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
    this.series = this.modelService.monopolyModel(this.modelParams());

  }

  ngAfterViewInit(): void {
    this._setupGraph();

  }

  public updateGraph() {
    let series = this.series;
    let q = this.quantity()!;
    this.revenueSeries = [];
    for (let i = 0; i <= q; i++) {
      this.revenueSeries.push([i, series.revenueFun(i)])
    }
    let profitSeries: any[] = [];
    profitSeries = this.modelService.createArea([[0, series.atcFun(q), series.demFun(q)], [q, series.atcFun(q), series.demFun(q)]]);
    this.chart1.series[4].setData(this.revenueSeries, true, false, false);
    this.chart1.series[5].setData(profitSeries, true, false, false);
    this.chart1.series[6].setData(this.keyValues().eqSeries, true, false, false);

    this.announcer.announce('The graph has been updated.')
  }




  private _setupGraph() {
    const container = this.el.nativeElement.querySelector('#chart1');
    this.series = this.modelService.monopolyModel(this.modelParams());
    let series = this.series;

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
          color: '#0771BD',
          lineWidth: 2,
          zIndex: 0,

          data: series.demand
        },
        {
          type: 'line',
          name: 'MR',
          color: '#2C89F3',
          lineWidth: 2,
          zIndex: 0,

          data: series.MR
        },
        {
          type: 'line',
          name: 'MC',
          color: '#C62828',
          lineWidth: 2,
          zIndex: 0,

          data: series.MC
        },
        {
          type: 'spline',
          name: 'ATC',
          color: '#37723B',
          lineWidth: 2,
          zIndex: 0,

          data: series.ATC
        },
        {
          type: 'spline',
          name: 'Total revenue',
          color: '#2C89F3',
          lineWidth: 2,
          zIndex: 1,
          yAxis: 1,

          data: []
        },
        {
          type: 'arearange',
          name: 'Profit',
          lineWidth: 1,
          color: '#AFD5A0',
          zIndex: -1,
          data: []
        },
        {
          type: 'line',
          name: 'Equlibrium',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 1,
          data: this.keyValues().eqSeries,
          label: { enabled: false },
          marker: {
            radius: 3,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xGood}` },
        min: this.graph().xMin,
        max: this.graph().xMax
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
        tickInterval: .5
      },
      {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        opposite: true,
        title: { text: 'Total revenue (millions of dollars)' },
        min: 0,
        max: 2400
      }],
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


  }


}
