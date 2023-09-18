import { Component, ElementRef, OnInit, signal, computed, Signal, WritableSignal } from '@angular/core';
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
import { MatRadioModule } from '@angular/material/radio';
import { BusPubLibModule } from 'bus-pub-lib';
import { ModelService } from '../model.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive-ho03',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interactive-ho03.component.html',
  styleUrls: ['./interactive-ho03.component.scss'],
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
export class InteractiveHO03Component implements OnInit {

  chart!: Highcharts.Chart;

  // signals
  p1x = signal(20);
  p2x = signal(30);
  p1y = signal(25);
  p2y = signal(30);

  p1oppCost = computed(() => {
    return this.p1y() / this.p1x();
  });

  pc1y = signal(0);
  pc1x = computed(() => {
    return this.p1x() - 1 / this.p1oppCost() * this.pc1y();
  });

  graph = computed(() => {
    return {
      title: 'PPF',
      caption: 'Your have the absolute',
      xTitle: 'Cherries (in pounds)',
      yTitle: 'Apples (in pounds)',
      xMin: 0,
      xMax: 50,
      yMin: 0,
      yMax: 50
      }
  });



  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }
  
  ngOnInit(): void {
    const yourPPF: any[] =  [{ x: 0, y: this.p1y(), oppCost: this.p1oppCost()}, {x: this.p1x(), y: 0, oppCost: this.p1oppCost()} ]
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
          name: 'Your PPF',
          lineWidth: 2,
          data: yourPPF
        },
        {
          type: 'line',
          name: 'Neighbor\'s PPF',
          lineWidth: 2,
          data: [{ x: 0, y: this.p2y(), name: this.p1oppCost() }, {x: this.p2x(), y: 0} ]
        }

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax,
        tickInterval: 5
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
        tickInterval: 5
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `<b>${this.graph().xTitle}: </b>{point.x:,.2f}<br/><b>${this.graph().yTitle}:</b> {point.y:.2f}<br/><b>Opp. Cost:</b> {point.oppCost:.2f} ${this.graph().yTitle}`
          },
          label: { enabled: true, style: { fontSize: '.75em' } }
        }
      },
    });
      
    
  }

  public updateView(input: WritableSignal<number>, event: any) {
    let value = event.target.valueAsNumber;
    input.set(value);
    console.log(event);

    this.chart.update({
      series: [
        {
          type: 'line',
          name: 'Your PPF',
          lineWidth: 2,
          data: [{ x: 0, y: this.p1y()}, {x: this.p1x(), y: 0} ]
        },
        {
          type: 'line',
          name: 'Neighbor\'s PPF',
          lineWidth: 2,
          data: [{ x: 0, y: this.p2y() }, {x: this.p2x(), y: 0} ]
        }

      ],
    });


    
    
  }

}
