import { AfterViewInit, Component, ElementRef, OnInit, signal, computed, effect } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

interface Profile {
  player1?: string,
  player2?: string,
  player3?: string,
  titleGraph: string,
  titleX: string,
  titleY: string,
  caption: string

}

@Component({
  selector: 'app-interactive5',
  standalone: true,
  imports: [CommonModule, FormsModule, BusPubLibModule, MatInputModule, MatFormFieldModule],
  templateUrl: './interactive6.component.html',
  styleUrls: ['./interactive6.component.scss'],
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
  
  
export class Interactive6Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;

  // signals
  goodX1 = signal(16);
  goodX2 = signal(8);
  goodY1 = signal(8);
  goodY2 = signal(16);

  keyValue = computed(() => {

    return {
      oppCost1: this.goodY1() / this.goodX1(),
      oppCost2: this.goodY2() / this.goodX2(),
      goodXT: this.goodX1() + this.goodX2(),
      goodYT: this.goodY1() + this.goodY2(),
    }
  });

  profile: Profile = {
    player1: 'Jamie',
    player2: 'Blair',
    player3: 'Total',
    titleGraph: 'Gains from Specialization',
    titleX: 'Number of websites produced',
    titleY: 'Number of computer programs produced',
    caption: `The production possibility curves (PPC) for Jamie and Blair. A third PPC shows the sum of possible outputs. A key point (T) shows the point where both individuals completely specialize according to their comparative advantage. `

  }


  constructor(private el: ElementRef, private announcer: LiveAnnouncer) {
    effect(() => {

      this._setupStep();
    })
   }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this._setupStep();
  }


  // Private methods
  private _setupStep() {
    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart1 = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: this.profile.caption
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: `${this.profile.titleGraph}`,
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
          lineWidth: 2,
          color: '#BE5717',
          name: `PPC<sub>${this.profile.player1}</sub>`,
          data: series.ppc1,
          label: {useHTML: true}
        },
        {
          type: 'line',
          lineWidth: 2,
          color: '#0066B2',
          name: `PPC<sub>${this.profile.player2}</sub>`,
          data: series.ppc2,
          label: {useHTML: true}
        },
        {
          type: 'line',
          lineWidth: 2,
          color: '#BB0170',
          name: `PPC<sub>${this.profile.player3}</sub>`,
          data: series.ppcT,
          label: {useHTML: true}
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.profile.titleX}` },
        min: 0,
        max: 28,
        tickInterval: 2
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.profile.titleY}` },
        min: 0,
        max: 25,
        tickInterval: 2
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          animation: false,
          tooltip: {
            headerFormat: '<b>{series.name}: </b> ',
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.2f}`
          },
          label: { enabled: true }
        }
      },

    });


  }

  private _createSeries() {

    let pointXT = this.keyValue().oppCost1 <= this.keyValue().oppCost2 ? this.goodX1() : this.goodX2();
    let pointYT = this.keyValue().oppCost1 <= this.keyValue().oppCost2 ? this.goodY2() : this.goodY1();


    let ppc1: any[] = [
      { x: 0, y: this.goodY1() },
      { x: this.goodX1(), y: 0 }
    ];
    let ppc2: any[] = [
      { x: 0, y: this.goodY2() },
      { x: this.goodX2(), y: 0 }

    ];
    let ppcT: any[] = [
      { x: 0, y: this.keyValue().goodYT },
      { x: pointXT, y: pointYT, marker: { enabled: true, radius: 4, fillColor: 'rgb(235, 235, 235)', lineWidth: 1, lineColor: 'black'} },
      { x: this.keyValue().goodXT, y: 0 }
    ];


    return {
      ppc1: ppc1,
      ppc2: ppc2,
      ppcT: ppcT,
      
    }
  }

}

