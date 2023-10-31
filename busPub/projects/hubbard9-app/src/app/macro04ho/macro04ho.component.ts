import { Component, ElementRef, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
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

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-macro04ho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './macro04ho.component.html',
  styleUrls: ['./macro04ho.component.scss'],
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
  
export class Macro04hoComponent implements OnInit {

  mode = signal(0);
  title = signal('Static AD/AS Model');
  chart!: Highcharts.Chart;

  graph = computed(() => {
    return {
      title: this.mode() === 0 ? 'Static AD/AS' : 'Dynamic AD/AS',
      caption: ``,
      xTitle: `Real GDP (trillions of 2017 dollars)`,
      yTitle: `Price level (GDP deflator, 2017 = 100)`,
      xMin: 0,
      xMax: 28,
      xInterval: 2,
      yMin: 25,
      yMax: 150,
      yInterval: 10
    }
  });


  constructor(private route: ActivatedRoute, private titleService: Title, private announcer: LiveAnnouncer, private macroModel: MacroModelService, private el: ElementRef ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const mode = +params['mode'];
      this.mode.set(mode);
      this.setTitle(mode);
    });
    this._setupGraph();
  }


  private _setupGraph() {
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
          data: [
            [0, 20],
            [28, 125]
          ]
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
          label: { enabled: true, style: { fontSize: '.75em'} }
        }
      },
    });

  }


  private setTitle(mode: number) {
    let newTitle = ``;
    switch (mode) {
      case 0:
        newTitle = `Static AD/AS Model`;
        break;
      case 1:
        newTitle = `Dynamic AD/AS Model`;
        break;
      case 2:
        newTitle = `Monetary Policy (Dynamic AD/AS)`;
        break;
      case 3:
        newTitle = `Fiscal Policy (Dynamic AD/AS)`;
        break;
      default:
        break;
    }
    this.titleService.setTitle(newTitle);
    this.title.set(newTitle);
  }
}
