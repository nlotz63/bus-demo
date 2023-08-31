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
import { ModelService } from 'projects/poe-app/src/app/model.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

interface ExtendedSVGElement extends Highcharts.SVGElement {
  drag: boolean;
}


@Component({
  selector: 'app-interactive15',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatRadioModule, MatButtonModule],
  templateUrl: './interactive15.component.html',
  styleUrls: ['./interactive15.component.scss'],
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
export class Interactive15Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  series!: any;
  mode = signal(0);
  tech1 = signal(4);
  tech2 = signal(8);
  labor = signal(100);
  exponent = signal(.5);
  xGoodValue = signal(20);
  yGoodValue = signal(34);
  xMax = signal(0);
  yMax = signal(0);
  factor = signal('capital');
  tech1Percent = signal(0);
  tech2Percent = signal(0);
  techBothPercent = signal(0);
  disableReset = true


  graph = computed(() => {
    return {
      xTitle: 'Guns',
      yTitle: 'Butter',
      title: 'Production Possibilities',
      caption: 'The production possibilities frontier (PPF) with guns on the horizontal axis and butter on the vertical axis.',
      xMin: 0,
      xMax: this.xMax(),
      yMin: 0,
      yMax: this.yMax(),
    }
  });

  modelParams = computed(() => {
    return {
      tech1: (1+ this.tech1Percent())*this.tech1(),
      tech2: (1+ this.tech2Percent())*this.tech2(),
      labor: this.labor(),
      exponent: this.exponent()
    }
  });


  constructor(private el: ElementRef, private annoucer: LiveAnnouncer, private modelService: ModelService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let mode = params['mode'] ? +params['mode'] : 0;
      this.mode.set(mode);
      this._setupGraph();

    });
  }

  ngAfterViewInit(): void {

  }

  public updateGraph() {
    if (this.disableReset) this.disableReset = false;
    const series = this.modelService.createPPF(this.modelParams());
    this.series = series;

    if (this.mode() === 1) {
      const point = this.el.nativeElement.querySelector('#draggablePoint'),
        text = this.el.nativeElement.querySelector('#draggableText');
      
      const pixX = this.chart1.xAxis[0].toPixels(this.xGoodValue(), false),
        pixY = this.chart1.yAxis[0].toPixels(this.yGoodValue(), false);
      point.setAttribute('cx', pixX);
      point.setAttribute('cy', pixY);
      text.setAttribute('x', pixX + 10);
      text.setAttribute( 'y', pixY - 10)
      this._updateDraggablePointData(point, text);
    } 


    this.chart1.update({
      series: [
        {
          type: 'spline',
          name: 'PPF',
          lineWidth: 2,
          data: series.PPF
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yTitle}` },
        min: this.graph().yMin,
        max: this.graph().yMax
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
    this.annoucer.announce('The graph and narrative have been updated.');
  }

  public updateMode0Graph() {
    this._setupGraph();
  }

  public reset() {
    this.tech1Percent.set(0);
    this.tech2Percent.set(0);
    this.techBothPercent.set(0);
    this.updateGraph();
    this.disableReset = true;

  }

  private _setupGraph() {
    const container = this.el.nativeElement.querySelector('#chart1');
    const series = this.modelService.createPPF(this.modelParams());
    this.series = series;
    this.xMax.set(series.xMax);
    this.yMax.set(series.yMax);

    this.chart1 = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
        events: {
          click: () => {
            let point = this.el.nativeElement.querySelector('#draggablePoint');
            let text = this.el.nativeElement.querySelector('#draggableText');
            this._updateDraggablePointData(point, text);

          }
        },
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
          type: 'spline',
          name: 'PPF',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.PPF
        },
        {
          type: 'spline',
          name: 'Initial PPF',
          dashStyle: 'LongDash',
          lineWidth: 1,
          zIndex: -1,
          color: 'rgb(95, 95, 95)',
          data: [],
          label: { enabled: false }
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.graph().yTitle}` },
        min: this.graph().yMin,
        max: this.graph().yMax
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
    if (this.mode() === 1) this.addDraggablePoint();

    if(this.mode() === 2 ) this.chart1.series[1].setData(series.PPF)

  }

  private _updateDraggablePointData(point: any, text: any) {

    let message: string = '';
    let xValue = point.getAttribute('cx'),
      yValue = point.getAttribute('cy'),
      epsilon = this.series.yMax <= 120 ? .5 : 1.5;
    let x = this.chart1.xAxis[0].toValue(Number(xValue)),
      y = this.chart1.yAxis[0].toValue(Number(yValue));
    this.xGoodValue.set(x);
    this.yGoodValue.set(y);
    let q2 = this.series.ppfFun(x);
    // set text
    if (y < q2 - epsilon) {
      message = 'Inefficient';
    } else if (y > q2 + epsilon || isNaN(q2)) {
      message = 'Unattainable';
    } else {
      message = 'Efficient';
    }
    text.innerHTML = message;

  }

  private addDraggablePoint() {
    let chart = this.chart1;
    let radius = 4,
      draggablePoint = chart.renderer
        .circle(225, 341, radius)
        .attr({
          fill: '#C41B1B',
          zIndex: 5,
          id: 'draggablePoint',
          stroke: 'black',
          'stroke-width': 1,
          tabIndex: 0,
          role: 'img',
          alt: 'Draggable Point'

        })
        .add() as ExtendedSVGElement,
      draggableText = chart.renderer.
        text('Inefficient', 235, 330).
        attr({
          id: 'draggableText'
        }).
        add();
    chart.container.onmousemove = function (e) {

      if (draggablePoint.drag) {
        let normalizedEvent = chart.pointer.normalize(e),
          extremes = {
            left: chart.plotLeft,
            right: chart.plotLeft + chart.plotWidth,
            top: chart.plotTop,
            bottom: chart.plotTop + chart.plotHeight
          };

        // Move line
        if (
          normalizedEvent.chartX >= extremes.left &&
          normalizedEvent.chartX <= extremes.right &&
          normalizedEvent.chartY >= extremes.top &&
          normalizedEvent.chartY <= extremes.bottom
        ) {
          draggablePoint.attr({
            x: normalizedEvent.chartX,
            y: normalizedEvent.chartY
          });
          draggableText.attr({
            x: normalizedEvent.chartX + 10,
            y: normalizedEvent.chartY - 10

          });
        }
        Highcharts.fireEvent(chart, 'click');

      }
    };
    draggablePoint.element.onmouseover = function () {
      draggablePoint.css({ 'cursor': 'pointer' })
    }

    draggablePoint.element.onmousedown = function () {
      draggablePoint.css({ 'color': 'green' });
      draggablePoint.drag = true;
    };

    draggablePoint.element.onmouseup = function () {
      draggablePoint.drag = false;
      draggablePoint.css({ 'color': '#C41B1B' });
    };

  }
}
