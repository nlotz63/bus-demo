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
  selector: 'app-interactive14',
  standalone: true,
  imports: [CommonModule, BusPubLibModule],
  templateUrl: './interactive14.component.html',
  styleUrls: ['./interactive14.component.scss'],
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
export class Interactive14Component implements OnInit, AfterViewInit {
  chart1!: Highcharts.Chart;
  quantity = signal(0);
  previousQ = 0;
  revenueSeries: any[] = [[0, 0]];
  series!: any;
  firms = signal(1);

  graph = signal(
    {
      xGood: 'Quantity (cups of coffee per day)',
      yGood: 'Price and cost (dollars per cup)',
      title: 'Monopolistic Firm',
      caption: 'The graph shows the cost curves for a typical firm in the market for gourmet coffee, along with the demand curve and associated marginal revenue curve it faces.',
      xMin: 0,
      xMax: 1200,
      yMin: 0,
      yMax: 10,
      xscale: 11,
      yscale: .1,
    }
  );
  keyValues = signal(
    {
      price: 5.16,
      atc: 3.39,
      quantity: 334,
      profit: 591.18
    }
  );

  modelParams: Signal<EconModel> = computed(() => {
    return {
      xMin: 0,
      xMax: 100,
      xStep: 5,
      xscale: this.graph().xscale,
      yscale: this.graph().yscale,
      demandIntercept: 5 + (0.694 - 0.025 * this.firms()) * 100,
      demandSlope: .694 - 0.025 * this.firms(),
      exponent: 3,
      fixed: 250,
      c0: .003225,
      c1: .011333,
      c2: -23.1
    }
  });



  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this._setupGraph();

  }

  public updateGraph() {
    let series = this.modelService.monopolyModel(this.modelParams());

    const q0 = 0, q1 = series.EQ[1].x, low = this.firms() <= 12 ? series.atcFun(q1) : series.EQ[1].y, high = this.firms() < 12 ? series.EQ[1].y : series.atcFun(q1);
    const profitTitle = this.firms() <= 12 ? 'Profit' : 'Loss';
    const profitColor = this.firms() <= 12 ? '#AFD5A0' : '#FFA2A4';

    let profitSeries = this.modelService.createArea([[q0, low, high], [q1, low, high]]);
    this.keyValues.set(
      {
        price: Number(series.demFun(q1).toFixed(2)),
        atc: Number(series.atcFun(q1).toFixed(2)),
        quantity: Number(q1.toFixed(0)),
        profit: (+series.demFun(q1).toFixed(2) - +series.atcFun(q1).toFixed(2))*+q1.toFixed(0)
      }
    );

    this.chart1.series[0].setData(series.demand, false, false, false);
    this.chart1.series[1].setData(series.MR, false, false, false);
    this.chart1.series[5].setData(series.EQ, true, false, false);
    this.chart1.series[4].update(
      {
        type: 'arearange',
        name: profitTitle,
        color: profitColor,
        data: profitSeries
      },
      true
    );
    this.announcer.announce('The graph has been updated');
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
        zooming: {
          type: 'xy'
        }
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
      legend: { enabled: true },
      tooltip: { useHTML: true, enabled: true, style: { fontWeight: '400', fontSize: '.85em'} },

      accessibility: {
        point: {
          valueDescriptionFormat: `quantity: {point.x:.0f}, {point.y:.2f} dollars.`
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
          showInLegend: false,
          data: series.demand,
          tooltip: {
            headerFormat: `<b>{series.name}:</b><br/>`,
            pointFormat: ` Price: \${point.y:,.2f}<br/> Quantity: {point.x:.0f}`
          },

          accessibility: {
            description: 'A straight line that slopes down from left to right.'
          }
        },
        {
          type: 'line',
          name: 'MR',
          color: '#2C89F3',
          lineWidth: 2,
          zIndex: 0,
          showInLegend: false,
          data: series.MR,
          accessibility: {
            description: 'A straight line that slopes down from left to right.'
          }
        },
        {
          type: 'spline',
          name: 'MC',
          color: '#C63F43',
          lineWidth: 2,
          zIndex: 0,
          showInLegend: false,
          data: series.MC,
          accessibility: {
            description: 'A curved line that slopes up from left to right.'
          }
        },
        {
          type: 'spline',
          name: 'ATC',
          lineWidth: 2,
          zIndex: 0,
          color: '#37723B',
          showInLegend: false,
          data: series.ATC,
          accessibility: {
            description: 'A curved line that forms a U-shaped curve.'
          }
        },
        {
          type: 'arearange',
          name: 'Profit',
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
          showInLegend: false,
          data: series.EQ,
          label: { enabled: false },
          marker: {
            radius: 3,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          },
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: 'Price: \${point.y:.2f}<br/>Quantity: {point.x:.0f}',
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
        tickInterval: 1
      },
      ],
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: `<b>{series.name}:</b> `,
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.0f}`
          },
          label: { useHTML: true, enabled: true, style: { fontSize: '.75em' } }
        }
      },
    });
    this.updateGraph();
  }


}
