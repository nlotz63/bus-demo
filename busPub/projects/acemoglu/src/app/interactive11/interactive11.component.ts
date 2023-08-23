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
import HC_pattern from 'highcharts/modules/pattern-fill';
import HC_accessibility from 'highcharts/modules/accessibility';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatRadioModule } from '@angular/material/radio';
import { BusPubLibModule } from 'bus-pub-lib';
import { ModelService, EconModel } from 'projects/poe-app/src/app/model.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpHandler } from '@angular/common/http';

HC_more(Highcharts);
HC_pattern(Highcharts);
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
  taxLabel = computed(() => this.applyTax() ? '$2 tax' : 'No tax');
  eqX = signal(375);
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
    let supplyShift = this.mode() === 0 ? this.keyValues().tax / this.graph().yscale : 0;
    let demandShift = this.mode() === 1 ? -this.keyValues().tax/ this.graph().yscale : 0;
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

  keyValues = computed(() => {
    let tax = this.applyTax() ? 2 : 0;

    return {
      incidence: Number((this.elasticitySupply() / (-this.elasticityDemand() + this.elasticitySupply())).toFixed(4)),
      tax: tax,
      revenue: Number((tax * this.eqX()).toFixed(2)),
      DWL: .5*tax*(375 - this.eqX())
    }
  });


  chartOptions: Highcharts.Options = {
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
    legend: { enabled: true, itemHiddenStyle: {color: 'white'}, useHTML: true },
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
    },
    series: [
      {
        type: 'line',
        name: 'Demand<sub>tax</sub>',
        lineWidth: 2,
        color: '#0771BD',
        zIndex: 0,
        data: [],
        showInLegend: false,
        visible: false
      },
      {
        type: 'line',
        name: 'Supply<sub>tax</sub>',
        lineWidth: 2,
        color: '#C62828',
        zIndex: 0,
        data: [],
        showInLegend: false,
        visible: false
      },
      {
        type: 'line',
        name: 'Equilibrium',
        color: 'black',
        dashStyle: 'Dash',
        zIndex: 1,
        data: [],
        label: { enabled: false },
        marker: {
          radius: 4,
          lineColor: 'black',
          lineWidth: 1,
          fillColor: 'rgb(235, 235, 235)'
        },
        showInLegend: false
      },
      {
        type: 'line',
        name: '',
        color: 'black',
        dashStyle: 'Dash',
        zIndex: 1,
        data: [],
        marker: {
          radius: 4,
          lineColor: 'black',
          lineWidth: 1,
          fillColor: 'rgb(235, 235, 235)'
        },
        label: {enabled: false},
        showInLegend: false
      },
      {
        type: 'line',
        name: '',
        dashStyle: 'Dash',
        color: 'black',
        data: [],
        showInLegend: false
      },
      {
        type: 'arearange',
        name: 'DWL',
        color: '#FED9D5',
        zIndex: -1,
        visible: false,
        data: []
      },
      {
        type: 'arearange',
        name: 'CS',
        color: '#FEC88F',
        zIndex: -1,
        data: []
      },
      {
        type: 'arearange',
        name: 'PS',
        color: '#ADEEE9',
        zIndex: -1,
        data: []
      },
      {
        type: 'arearange',
        name: 'C<sub>burden</sub>',
        zIndex: -1,
        visible: false,
        label: { style: { color: 'black' } },
        data: [],
        color: {
          patternIndex: 8,
          pattern: {
            //path: 'M 0 0 H 5 M 5 5 H 10 ',
            width: 10,
            height: 10,
            color: '#E0602F'
          }
        }
      },
      {
        type: 'arearange',
        name: 'P<sub>burden</sub>',
        zIndex: 1,
        label: { style: { color: 'black' },  },
        visible: false,
        data: [],
        color: {
          patternIndex: 6,

          pattern: {
            //path: 'M 0 10 L 2 8 M 4 6 L 6 4',
            width: 10,
            height: 10,
            color: '#6277C2',
            backgroundColor: 'white',
          }
        },
      },
      // Initial curves
      {
        type: 'line',
        name: 'Demand',
        lineWidth: 2,
        color: '#0771BD',
        zIndex: 0,
        data: [],
        showInLegend: false
      },
      {
        type: 'line',
        name: 'Supply',
        lineWidth: 2,
        color: '#C62828',
        zIndex: 0,
        data: [],
        showInLegend: false
      },
      {
        type: 'line',
        name: 'Equilibrium',
        color: 'black',
        dashStyle: 'Dash',
        lineWidth: 1,
        zIndex: 1,
        data: [],
        label: { enabled: false },
        marker: {
          radius: 4,
          lineColor: 'black',
          lineWidth: 1,
          fillColor: 'rgb(235, 235, 235)'
        },
        showInLegend: false
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
      },
      arearange: {
      }

    },

  }


  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
   }

  ngAfterViewInit(): void {
    this.updateGraph(true);

  }

  public updateGraph(initialize?: boolean) {
    if (initialize) {
      const container = this.el.nativeElement.querySelector('#chart1');
      this.chart1 = new Highcharts.Chart(container, this.chartOptions);

    }
    let series = this.modelService.demandSupply(this.modelParams());
    let series1 = this.modelService.demandSupply(this.modelParams1());
    let point: any = [], dwlArea: any[] = [], pointName = '', eqName = '';
    let x0 = 0, x1 = series1.EQ[1].x, x2 = series.EQ[1].x;
    let y0 = series.supply[0].y, y1 = 0, y3 = series1.EQ[1].y, y2 = series.EQ[1].y, y4 = series.demand[0].y, y5 = 0, setZ, demVis = false, supVis = false, ciVis = false, piVis = false, dwlVis = false;
    
    this.eqX.set(series1.EQ[1].x);

    switch (this.mode()) {
      case 0:
        pointName = 'Q<sub>d</sub>';
        eqName = 'Q<sub>s</sub>';
        point = [
          { x: 0, y: series1.EQ[1].y - this.keyValues().tax },
          { x: series1.EQ[1].x, y: series1.EQ[1].y - this.keyValues().tax, marker: { enabled: true } },
        ];
        y1 = series1.EQ[1].y - this.keyValues().tax;
        y3 = series1.EQ[1].y;
        setZ = 2;
        supVis = this.applyTax() ? true : false;
        demVis = false
        break;

      default:
        y1 = series1.EQ[1].y;
        y3 = series1.EQ[1].y + this.keyValues().tax;

        point = [
          { x: 0, y: series1.EQ[1].y + this.keyValues().tax },
          { x: series1.EQ[1].x, y: series1.EQ[1].y + this.keyValues().tax, marker: { enabled: true } },
          { x: series1.EQ[1].x, y: series1.EQ[1].y }
        ];
        setZ = 0;
        supVis = false;
        demVis =  this.applyTax() ? true : false;
        break;
    }

    if (this.applyTax()) {
      piVis = true, ciVis = true, dwlVis = true;
    }

    let eqSeries = [
      { x: series.EQ[1].x, y: series.EQ[1].y, marker: { enabled: true } },
      { x: series.EQ[1].x, y: 0}
    ];

    let sepSeries = [
      { x: 0, y: series.EQ[1].y },
      { x: series1.EQ[1].x, y: series.EQ[1].y}
    ];

    let dwl = this.modelService.createArea([[x1, y1, y3], [x2, y2, y2]]);
    let cs = this.modelService.createArea([[x0, y3, y4], [x1, y3, y3]]);
    let ps = this.modelService.createArea([[x0, y0, y1], [x1, y1, y1]]);
    let ci = this.modelService.createArea([[x0, y2, y3], [x1, y2, y3]]);
    let pi = this.modelService.createArea([[x0, y1, y2], [x1, y1, y2]]);

    this.chart1.update({
      series: [
        {
          type: 'line',
          color: '#0771BD',
          zIndex: 0,
          data: series1.demand,
          visible: demVis
        },
        {
          type: 'line',
          color: '#C62828',
          zIndex: 0,
          data: series1.supply,
          visible: supVis
        },
        {
          type: 'line',
          name: eqName,
          data: series1.EQ,
        },
        {
          type: 'line',
          name: pointName,
          zIndex: setZ,
          data: point,
        },
        {
          type: 'line',
          data: sepSeries
        },
        {
          type: 'arearange',
          name: 'DWL',
          zIndex: -1,
          data: dwl,
          visible: dwlVis
        },
        {
          type: 'arearange',
          name: 'CS',
          zIndex: -1,
          data: cs,
        },
        {
          type: 'arearange',
          name: 'PS',
          data: ps
        },
        {
          type: 'arearange',
          zIndex: -1,
          data: ci,
          visible: ciVis
        },
        {
          type: 'arearange',
          zIndex: -1,
          data: pi,
          visible: piVis
        },
        // Initial curves
        {
          type: 'line',
          name: 'Demand',
          data: series.demand,
        },
        {
          type: 'line',
          data: series.supply,
        },
        {
          type: 'line',
          name: 'Equilibrium',
          data: eqSeries,
        },
      ],
    }, true);
    this.announcer.announce('The graph has been updated.');
  }
}
