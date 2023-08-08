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
  selector: 'app-interactive10',
  standalone: true,
  imports: [CommonModule, MatRadioModule, BusPubLibModule],
  templateUrl: './interactive10.component.html',
  styleUrls: ['./interactive10.component.scss'],
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
export class Interactive10Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  mode = signal(0);
  demandShift = signal(0);
  supplyShift = signal(0);


  graph = computed(() => {
    let xscaler = 10, yscaler = .005, xGood = 'Quantity of electricity produced (in billions of kWh)', yGood = 'Price (cents per kWh)', title = 'Market for Electricity Produced with Coal',caption = 'The market for electricity produced with coal in equilibrium without taking into account the negative externality.', price = .25, min = 0, max = 25, step = 5, xMin = 100, xMax = 600, yMin = 0, yMax = .5;

    if (this.mode() === 1) {
      xscaler = 1.145, yscaler = .8, xGood = 'Quantity of education (in millions of years)', yGood = 'Price (in thousands of dollars)', title = 'Market for Education', caption = 'The market for education in equilibrium without taking into account the positive externality of education.', price = 25, min = 0, max = 25, step = 5, xMin = 10, xMax = 70, yMin = 0, yMax = 80;

    };
    return {
      xscaler: xscaler,
      yscaler: yscaler,
      xGood: xGood,
      yGood: yGood,
      title: title,
      caption: caption,
      price: price,
      min: min,
      max: max,
      step: step,
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    }
  });

  modelParams: Signal<EconModel> = computed(() => {
    return {
      xMin: 15,
      xMax: 55,
      xStep: 5,
      xscale: this.graph().xscaler,
      yscale: this.graph().yscaler,
      price1: this.graph().price,
      demandIntercept: 120 + this.demandShift(),
      demandSlope: 2,
      supplyIntercept: -13 + this.supplyShift(),
      supplySlope: 1.8
    }
  })


  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }

  ngOnInit(): void {
    this.modelService.demandSupply(this.modelParams());
    
  }

  ngAfterViewInit(): void {

    this._setupGraph();
    
  }

  public setMode(value: number) {
    this.mode.set(value);
    this.demandShift.set(0);
    this.supplyShift.set(0);
    this._setupGraph();
  }

  public updateGraph(value: number) {
    
    if (this.mode() === 0) {
      this.supplyShift.set(value);
    } else {
      this.demandShift.set(value);
    }
    let series = this.modelService.demandSupply(this.modelParams());
    let series1 = this.modelService.demandSupply({
      xscale: 1,
      yscale: 1
    });
    const dwlSeries = [
      {
        x: this.mode() === 0 ? 350 : 40,
        low: this.mode() === 0 ? .25 : 40,
        high: this.mode() === 0 ? series.supFunct(350) : series.demFunct(40)
      },
      {
        x: series.EQ[1].x,
        low: series.EQ[1].y,
        high: series.supFunct(series.EQ[1].x)
      }
    ];
    let hideDem = this.mode() === 1 && value >= 1 ? true : false;
    let hideSup = this.mode() === 0 && value >= 1 ? true : false;


      this.chart1.update({
        series: [
          {
            type: 'line',
            lineWidth: 2,
            color: '#0771BD',
            zIndex: 0,
            data: series.demand,
            visible: hideDem
          },
          {
            type: 'line',
            lineWidth: 2,
            color: '#C62828',
            zIndex: 0,
            data: series.supply,
            visible: hideSup
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
            data: dwlSeries
          },
  
        ],
  
      });
    this.announcer.announce('The graph has been updated')

  }

  private _setupGraph() {
    const chartContainer = this.el.nativeElement.querySelector('#chart1');
    const series = this.modelService.demandSupply(this.modelParams());
    if (this.chart1) this.chart1.destroy();
    this.chart1 = new Highcharts.Chart(chartContainer, {
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
          visible: false
        },
        {
          type: 'line',
          name: 'MSC',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,
          visible: false
        
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
          data: series.supply
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
    let message = this.mode() === 0 ? 'The negative externality option has loaded' : 'The positive externality option has loaded';
    this.announcer.announce(message);

  }
}
