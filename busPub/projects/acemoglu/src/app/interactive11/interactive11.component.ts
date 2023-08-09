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
  imports: [CommonModule, MatRadioModule, BusPubLibModule],
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
  elasticityDemand = signal(.75);
  elasticitySupply = signal(.75);
  tax = signal(0);

  graph = signal(
    {
      xGood: 'Quantity (plates per day)',
      yGood: 'Price per plate',
      title: 'Market for Jambalaya',
      caption: 'The market for jambalaya in equilbrium.',
      xMin: 0,
      xMax: 850,
      yMin: 0,
      yMax: 10


    }
  );

  modelParams: Signal<EconModel> = computed(() => {
    return {
      xMin: 0,
      xMax: 80,
      step: 10,
      xscale: 10,
      yscale: .1,
      demandIntercept: 47.5 + this.elasticityDemand()*37.5,
      supplyIntercept: 47.5 - this.elasticitySupply()*37.5,
      demandSlope: this.elasticityDemand(),
      supplySlope: this.elasticitySupply()
    }
  })


  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this._setupGraph();
    
  }

  public updateGraph(value: number) {
    let series = this.modelService.demandSupply(this.modelParams());
    this.chart1.update({
      series: [
        {
          type: 'line',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
        },
        {
          type: 'line',
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
          data: []
        },

      ],

    }, true);

  }

  private _setupGraph() {
    let series = this.modelService.demandSupply(this.modelParams()); 
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
          name: 'MSB',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
        },
        {
          type: 'line',
          name: 'MSC',
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
          label: {enabled: false},
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
          label: { enabled: true, style: { fontSize: '.75em'} }
        }
      },

    });

  }
}
