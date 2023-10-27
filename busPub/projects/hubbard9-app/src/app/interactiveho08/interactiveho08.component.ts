import { Component, ElementRef, OnInit, signal, computed, Signal } from '@angular/core';
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

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactiveho08',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactiveho08.component.html',
  styleUrls: ['./interactiveho08.component.scss'],
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
export class Interactiveho08Component implements OnInit {

  chart!: Highcharts.Chart;


  graph = signal({
    title: `Emissions Reduction`,
    caption: `The determination of optimal emissions reduction using marginal analysis.`,
    xTitle: `Reduction in sulfur dioxide emissions (in millions of tons per year)`,
    yTitle: `Cost or benefit (dollars per ton)`,
    xMin: 4,
    xMax: 12,
    xInterval: 1,
    yMin: 0,
    yMax: 400,
    yInterval: 50
  });

  modelParams: Signal<EconModel> = computed(() => {
    return {
      demandIntercept: 191.3345,
      supplyIntercept: -34.9,
      demandSlope: 3.541666667,
      supplySlope: 2.1275,
      xMin: 25,
      xMax: 52,
      xStep: 1,
      xscale: .2125,
      yscale: 4,
      
    }
  });

  constructor(private el: ElementRef, private modelService: ModelService, private announcer: LiveAnnouncer) { }
  
  ngOnInit(): void {
    this._setupGraph();
    
  }


  private _setupGraph() {
    const series = this.modelService.demandSupply(this.modelParams());
    const container = this.el.nativeElement.querySelector('#chart1');

    this.chart = new Highcharts.Chart(container, {
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
        {
          type: 'line',
          name: 'MSB',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
          visible: true
        },
        {
          type: 'line',
          name: 'MSC',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,
          visible: true
        
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax,
        tickInterval: this.graph().xInterval
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yTitle}` },
        min: this.graph().yMin,
        max: this.graph().yMax,
        tickInterval: this.graph().yInterval
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '<b>{series.name}: </b> ',
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.1f}`
          },
          label: { enabled: true, style: { fontSize: '.75em'} }
        }
      },

    });
  }


}
