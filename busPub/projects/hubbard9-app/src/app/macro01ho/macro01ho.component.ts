import { Component, ElementRef, OnInit, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
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

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);
@Component({
  selector: 'app-macro01ho',
  standalone: true,
  imports: [CommonModule, BusPubLibModule],
  templateUrl: './macro01ho.component.html',
  styleUrls: ['./macro01ho.component.scss'],
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
  
  
export class Macro01hoComponent implements OnInit {

  chart!: Highcharts.Chart;
  // signals here
  shiftC0 = signal(1);

  graph = signal({
    title: 'Aggregate Expenditure',
    caption: '',
    xTitle: 'Real GDP, Y (trillions of 2012 dollars)',
    yTitle: 'Real aggregate expenditure, AE (tillions of 2012 dollars)',
    xMin: 0,
    xMax: 28,
    yMin: 0,
    yMax: 28,
  });

  modelParams = computed(() => {

    return {
      c0: this.shiftC0(),
      mpc: .75,
      t0: .09,
      t1: 0.05,
      i0: 2.5,
      iy: 0,
      ir: .03,
      g0: 2.5,
      nx0: -1
    }
  });

  modelParams$ = toObservable(this.modelParams);

  constructor(private announcer: LiveAnnouncer, private el: ElementRef, private macroService: MacroModelService) {}

  ngOnInit(): void {

    this.modelParams$.subscribe((params) => {
      this.macroService.setParamters(params);
      this._setupGraph();
    })
  // this._setupGraph();
  }
  public updateGraph() {

  }

  private _setupGraph() {
    const consumption = this.macroService.seriesMaker(0, 30, .5, (x: number) => 1 + .5*x);
    const cPlusI = this.macroService.AE(3).consumption;
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
          fontWeight: '300',
          fontSize: '1em'

        }
      },
      legend: { enabled: false },
      tooltip: {
        useHTML: true, enabled: true,
        positioner: function (w, h, p) {
          const x = this.chart.plotWidth - .75*w, y = h;
          return {x: x, y: y}
        },
        borderWidth: 0,
        shadow: false
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
          lineWidth: 2,
          data: consumption
        },
        {
          type: 'line',
          lineWidth: 2,
          data: cPlusI
      },

        {
          type: 'line',
          name: 'Y = AE',
          lineWidth: 1,
          color: 'black',
          data: [[0,0], [26, 26]]
        }

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax,
        tickInterval: 2
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
        tickInterval: 2
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          label: { enabled: true, style: { fontSize: '.75em' } },
          animation: false
        }
      },

    });

  }
}
