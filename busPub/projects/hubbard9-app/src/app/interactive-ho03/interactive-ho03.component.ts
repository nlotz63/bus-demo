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
  chart2!: Highcharts.Chart;

  // signals
  p1x = signal(20);
  p2x = signal(60);
  p1y = signal(20);
  p2y = signal(30);
  trd1 = signal(0);

  p1oppCost = computed(() => {
    return this.p1y() / this.p1x();
  });

  p2oppCost = computed(() => {
    return this.p2y() / this.p2x();
  });


  pc1x = signal(5);
  pc1y = computed(() => {
    return this.p1y() - this.p1oppCost() * this.pc1x();
  });

  pc2x = signal(5);
  pc2y = computed(() => {
    return this.p2y() - this.p2oppCost() * this.pc2x();
  });

  pwt1x = computed(() => {
    return this.p1oppCost() < this.p2oppCost() ? this.p1x() : 0;
  });
  
  pwt1y = computed(() => {
    return this.p1oppCost() >= this.p2oppCost() ? this.p1y() : 0;
  }); 
  
  pwt2x = computed(() => {
    return this.p2oppCost() <= this.p1oppCost() ? this.p2x() : 0;
  }); 

  pwt2y = computed(() => {
    return this.p2oppCost() > this.p1oppCost() ? this.p2y() : 0;
  }); 

  exRate = computed(() => {
    let rate = (this.p1oppCost() + this.p2oppCost()) / 2;
    return this.p1oppCost() < this.p2oppCost() ? +rate.toPrecision(2) : +(1/ rate).toPrecision(2);
  });

  ca1 = computed(() => {
    return this.p1oppCost() < this.p2oppCost() ? 'cherries' : 'apples';
  });

  ca2 = computed(() => {
    return this.p2oppCost() <= this.p1oppCost() ? 'cherries' : 'apples';
  });

  trade = computed(() => {
    const caCherries = this.p1oppCost() < this.p2oppCost() ? true : false;
    const prod1Max = caCherries ? this.p1x() : this.p1y(), prod2Max = caCherries ? this.p2y() : this.p2x(),
      rec1 = this.exRate() * this.trd1();
    
    return {
      cwt1x: caCherries ? +(prod1Max - this.trd1()).toPrecision(2) : +rec1.toPrecision(2),
      cwt1y: !caCherries ? +(prod1Max - this.trd1()).toPrecision(2) : +rec1.toPrecision(2),
      cwt2x: caCherries ? +rec1.toPrecision(2) : +(prod2Max - this.trd1()).toPrecision(2),
      cwt2y: !caCherries ? +rec1.toPrecision(2) : +(prod2Max - this.trd1()).toPrecision(2),
      receive: rec1.toPrecision(2),
      tradeMax: prod1Max
    }
  });

  gains = computed(() => {

    return {
      g1x: this.trade().cwt1x - this.pc1x(),
      g1y: this.trade().cwt1y - this.pc1y(),
      g2x: this.trade().cwt2x - this.pc2x(),
      g2y: this.trade().cwt2y - this.pc2y(),
    }
    
  });



  graph1 = computed(() => {
    return {
      title: 'Your PPF',
      caption: 'Your have the absolute',
      xTitle: 'Cherries (in pounds)',
      yTitle: 'Apples (in pounds)',
      xMin: 0,
      xMax: 60,
      yMin: 0,
      yMax: 60
      }
  });

  graph2 = computed(() => {
    return {
      title: 'Your Neighbor\'s PPF',
      caption: 'Your have the absolute',
      xTitle: 'Cherries (in pounds)',
      yTitle: 'Apples (in pounds)',
      xMin: 0,
      xMax: 60,
      yMin: 0,
      yMax: 60
      }
  });

  constructor(private el: ElementRef, private announcer: LiveAnnouncer, private modelService: ModelService) { }
  
  ngOnInit(): void {
    const yourPPF: any[] =  [{ x: 0, y: this.p1y(), oppCost: this.p1oppCost()}, {x: this.p1x(), y: 0, oppCost: this.p1oppCost()} ]
    const container = this.el.nativeElement.querySelector('#chart1');
    const container2 = this.el.nativeElement.querySelector('#chart2');
    this.chart = new Highcharts.Chart(container, {
      chart: {
        height: 350,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: this.graph1().caption
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.graph1().title}`,
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
          color: '#779A3D',
          data: yourPPF,
          label: {enabled: false}
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph1().xTitle}` },
        min: this.graph1().xMin,
        max: this.graph1().xMax,
        tickInterval: 5
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph1().yTitle}` },
        min: this.graph1().yMin,
        max: this.graph1().yMax,
        tickInterval: 5
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `<b>${this.graph1().xTitle}: </b>{point.x:,.2f}<br/><b>${this.graph1().yTitle}:</b> {point.y:.2f}<br/><b>Opp. Cost:</b> {point.oppCost:.2f} ${this.graph1().yTitle}`
          },
          label: { enabled: true, style: { fontSize: '.75em' } }
        }
      },
    });
    this.chart2 = new Highcharts.Chart(container2, {
      chart: {
        height: 350,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: this.graph2().caption
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.graph2().title}`,
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
          name: 'Neighbor\'s PPF',
          lineWidth: 2,
          color: '#779A3D',
          data: [{ x: 0, y: this.p2y(), name: this.p1oppCost() }, { x: this.p2x(), y: 0 }],
          label: {enabled: false}
        }

      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph2().xTitle}` },
        min: this.graph2().xMin,
        max: this.graph2().xMax,
        tickInterval: 5
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph2().yTitle}` },
        min: this.graph2().yMin,
        max: this.graph2().yMax,
        tickInterval: 5
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `<b>${this.graph2().xTitle}: </b>{point.x:,.2f}<br/><b>${this.graph2().yTitle}:</b> {point.y:.2f}<br/><b>Opp. Cost:</b> {point.oppCost:.2f} ${this.graph2().yTitle}`
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

      ],
    });

    this.chart2.update({
      series: [
        {
          type: 'line',
          name: 'Neighbor\'s PPF',
          lineWidth: 2,
          data: [{ x: 0, y: this.p2y() }, {x: this.p2x(), y: 0} ]
        }

      ]

    });


    
    
  }

}
