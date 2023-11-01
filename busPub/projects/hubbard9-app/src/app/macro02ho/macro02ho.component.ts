import { Component, ElementRef, OnInit, signal, computed, ViewChild, AfterViewInit, Signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { transition, trigger, style, animate } from '@angular/animations';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MacroModelService } from '../macro-model.service';
import { BusPubLibModule } from 'bus-pub-lib';
import { EconModel, ModelService } from '../model.service';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);


@Component({
  selector: 'app-macro02ho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './macro02ho.component.html',
  styleUrls: ['./macro02ho.component.scss'],
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

export class Macro02hoComponent implements OnInit {

  chart!: Highcharts.Chart;

  graph = signal(
    {
      title: 'Loanable Funds Market',
      caption: ``,
      xTitle: `Loanable funds (trillions of dollars per year)`,
      yTitle: `Real interest rate`,
      xMin: 0,
      xMax: 6,
      xInterval: 1,
      yMin: 0,
      yMax: 5,
      yInterval: .5
    }
  );

  modelParams: Signal<EconModel> = computed(() => {
    return {
      demandIntercept: 50,
      demandSlope: 1,
      xMin: 5,
      xStep: 4.2,
      xMax: 47,
      xscale: .125,
      yscale: .1
    }
    
  });



  constructor(private announcer: LiveAnnouncer, private microoModel: ModelService, private el: ElementRef) { }

  ngOnInit(): void {
    this._setupGraph();
  }


  private _setupGraph() {
    const container = this.el.nativeElement.querySelector('#chart1');
    const series = this.microoModel.demandSupply(this.modelParams());

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
          dashStyle: 'Dot',
          zIndex: 1,
          color: 'black',
          data: series.EQ,
          label: { enabled: false },
          marker: { radius: 4, lineWidth: 1, lineColor: 'black', fillColor: '#FAF6EE'}
        
      },
        {
          type: 'line',
          name: 'D',
          lineWidth: 2,
          color: '#0166B3',
          data: series.demand
        },
        {
          type: 'line',
          name: 'S',
          lineWidth: 2,
          color: '#B0092C',

          data: series.supply
        }


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
          label: { enabled: true, useHTML: true, style: { fontSize: '.75em'} }
        }
      },
    });

  }


}
