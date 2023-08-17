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
import { MatRadioModule } from '@angular/material/radio';
import { BusPubLibModule } from 'bus-pub-lib';
import { ModelService, EconModel } from 'projects/poe-app/src/app/model.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive11',
  standalone: true,
  imports: [CommonModule, MatRadioModule, BusPubLibModule, MatSlideToggleModule],
  templateUrl: './interactive11.component.html',
  styleUrls: ['./interactive11.component.scss'],
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
export class Interactive11Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  mode = signal(0);
  elasticityDemand = signal(-1.45);
  elasticitySupply = signal(1.7);
  applyTax = signal(false);
  tax = computed((): number => {
    return this.applyTax() ? 2 : 0;
  });
  taxLabel = computed(() => this.applyTax() ? '$2 tax' : 'No tax');
  graph = signal(
    {
      xGood: 'Quantity (plates per day)',
      yGood: 'Price per plate',
      title: 'Market for Jambalaya',
      caption: 'The market for jambalaya in equilbrium.',
      xMin: 0,
      xMax: 850,
      yMin: 0,
      yMax: 10,
      xscale: 10,
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
      xMax: 80,
      step: 10,
      xscale: this.graph().xscale,
      yscale: this.graph().yscale,
      demandIntercept: 47.5 + -47.5 / this.elasticityDemand(),
      supplyIntercept: 47.5 - 47.5 / this.elasticitySupply(),
      demandSlope: -47.5 / (37.5 * this.elasticityDemand()),
      supplySlope: 47.5 / (37.5 * this.elasticitySupply()),
    }
  });

  modelParams1: Signal<EconModel> = computed(() => {
    let supplyShift = this.mode() === 0 ? this.tax() / this.graph().yscale : 0;
    let demandShift = this.mode() === 1 ? -this.tax() / this.graph().yscale : 0;
    return {
      xMin: 0,
      xMax: 80,
      step: 10,
      xscale: this.graph().xscale,
      yscale: this.graph().yscale,
      demandIntercept: 47.5 + -47.5 / this.elasticityDemand() + demandShift,
      supplyIntercept: 47.5 - 47.5 / this.elasticitySupply() + supplyShift,
      demandSlope: -47.5 / (37.5 * this.elasticityDemand()),
      supplySlope: 47.5 / (37.5 * this.elasticitySupply()),
    }
  });


  incidence = computed(() => this.elasticitySupply() / (-this.elasticityDemand() + this.elasticitySupply()));


  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
    let series = this.modelService.demandSupply(this.modelParams());
    this.keyValues = {
      initEQ: series.EQ[1].x,
      initEP: series.EQ[1].y,
    }


  }

  ngAfterViewInit(): void {
    this._setupGraph();

  }

  public reset() {
    this.elasticityDemand.set(-1.45);
    this.elasticitySupply.set(1.7);
    this.applyTax.set(false);
    this.updateGraph();
  }

  public updateGraph() {
    let series = this.modelService.demandSupply(this.modelParams());
    let series1 = this.modelService.demandSupply(this.modelParams1());
    let point: any = [], dwlArea: any[] = [], pointName = '', eqName = '';
    let x0 = 0, x1 = series1.EQ[1].x, x2 = series.EQ[1].x;
    let y0 = series.supply[0].y, y1 = 0, y3 = series1.EQ[1].y, y2 = series.EQ[1].y, y4 = series.demand[0].y, y5 = 0;

    switch (this.mode()) {
      case 0:
        pointName = 'Q<sub>d</sub>';
        eqName = 'Q<sub>s</sub>';
        point = [
          { x: 0, y: series1.EQ[1].y - this.tax() },
          { x: series1.EQ[1].x, y: series1.EQ[1].y - this.tax(), marker: { enabled: true } },
          { x: series1.EQ[1].x, y: 0 }
        ];
        y1 = series1.EQ[1].y - this.tax();
        y3 = series1.EQ[1].y;
        break;

      default:
        y1 = series1.EQ[1].y;
        y3 = series1.EQ[1].y + this.tax();

        point = [
          { x: 0, y: series1.EQ[1].y + this.tax() },
          { x: series1.EQ[1].x, y: series1.EQ[1].y + this.tax(), marker: { enabled: true } },
          { x: series1.EQ[1].x, y: 0 }
        ];
        break;
    }
    let dwl = this.modelService.createArea([[x1, y1, y3], [x2, y2, y2]]);
    let cs = this.modelService.createArea([[x0, y3, y4], [x1, y3, y3]]);
    let ps = this.modelService.createArea([[x0, y0, y1], [x1, y1, y1]]);
    let ci = this.modelService.createArea([[x0, y2, y3], [x1, y2, y3]]);
    let pi = this.modelService.createArea([[x0, y1, y2], [x1, y1, y2]]);

    this.chart1.update({
      series: [
        {
          type: 'line',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series1.demand,
        },
        {
          type: 'line',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series1.supply,
        },
        {
          type: 'line',
          name: eqName,
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: series1.EQ,
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'line',
          name: pointName,
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: point,
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'arearange',
          name: 'DWL',
          zIndex: -1,
          data: dwl
        },
        {
          type: 'arearange',
          name: 'CS',
          zIndex: -1,
          data: cs
        },
        {
          type: 'arearange',
          name: 'PS',
          data: ps
        },
        {
          type: 'arearange',
          zIndex: -1,
          name: 'CI',
          data: ci
        },
        {
          type: 'arearange',
          zIndex: -1,
          name: 'PI',
          data: pi
        },
        // Initial curves
        {
          type: 'line',
          name: 'Demand',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
        },
        {
          type: 'line',
          name: 'Supply',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,

        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: series.EQ,
          label: { enabled: false },
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },


      ],

    }, true);

  }

  private _setupGraph() {
    let series = this.modelService.demandSupply(this.modelParams());
    let series1 = this.modelService.demandSupply(this.modelParams1());

    const container = this.el.nativeElement.querySelector('#chart1');
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
          name: 'Demand<sub>tax</sub>',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series1.demand,
        },
        {
          type: 'line',
          name: 'Supply<sub>tax</sub>',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series1.supply,

        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: series1.EQ,
          label: { enabled: false },
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'line',
          name: '',
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: [],
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },
        {
          type: 'arearange',
          name: 'DWL',
          data: []
        },
        {
          type: 'arearange',
          name: 'CS',
          data: []
        },
        {
          type: 'arearange',
          name: 'PS',
          data: []
        },
        {
          type: 'arearange',
          name: 'CI',
          data: []
        },
        {
          type: 'arearange',
          name: 'PI',
          data: []
        },
        // Initial curves
        {
          type: 'line',
          name: 'Demand',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
        },
        {
          type: 'line',
          name: 'Supply',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,

        },
        {
          type: 'line',
          name: 'Equilibrium',
          color: 'black',
          dashStyle: 'Dot',
          zIndex: 1,
          data: series.EQ,
          label: { enabled: false },
          marker: {
            radius: 4,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          }
        },

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xGood}` },
        min: this.graph().xMin,
        max: this.graph().xMax
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yGood}` },
        min: this.graph().yMin,
        max: this.graph().yMax
      },
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
