import { AfterViewInit, Component, ElementRef, OnInit, signal, computed, effect, Signal} from '@angular/core';
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

interface controls {
  tech1: number,
  tech2: number,
  exponent: number,
  labor: number

}

@Component({
  selector: 'app-interactive7',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interactive7.component.html',
  styleUrls: ['./interactive7.component.scss']
})
  
export class Interactive7Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;

  controls: Signal<controls> = signal({
    tech1: 7,
    tech2: 7,
    exponent: .5,
    labor: 100


  });



  profile: Profile = {
    titleGraph: 'Production Possibilities Curve',
    titleX: 'Production of apples',
    titleY: 'Production of oranges',
    caption: `The PPC for apples and oranges demonstrates increasing opportunity cost`
  }


  constructor(private announcer: LiveAnnouncer, private el: ElementRef) {

  }

  ngOnInit(): void {
    this._createSeries();
  }

  ngAfterViewInit(): void {
    this._setupGraph();
  }

  public updateGraph() { }
  
  private _setupGraph() {
    let series = this._createSeries();
    const container1 = this.el.nativeElement.querySelector('#container1');
    this.chart1 = new Highcharts.Chart(container1, {
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
          type: 'spline',
          name: 'PPC',
          lineWidth: 2,
          data: series.ppf
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.profile.titleX}` },
        min: 0,
        max: 100
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: `${this.profile.titleY}` },
        min: 0,
        max: 100
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          animation: false,
          tooltip: {
            headerFormat: '<b>{series.name}: </b> ',
            pointFormat: `\${point.y:,.2f}<br/><b>Quantity:</b> {point.x:.2f}<br/>opportunity cost: {point.oppCost:.2f}`
          },
          label: { enabled: true }
        }
      },

    });

   }
  
  private _createSeries() {
    let controls = this.controls();
    let tech1 = controls.tech1, tech2 = controls.tech2, exponent = controls.exponent, labor = controls.labor;
    let ppfSeries: any[] = [];
    let x = 0, labor1 = (x: number) => Math.pow(x / tech1, 2);

    let ppf = (x: number) => tech2 * Math.pow(labor - labor1(x), exponent);
    let derivative = (x: number) => -exponent * tech2 * Math.pow(labor - Math.pow((x / tech1), 1 / exponent), exponent - 1) * (1 / exponent) / Math.pow(tech1, 1 / exponent) * Math.pow(x, 1 / exponent - 1);

    do {
      let point = {
        x: x,
        y: ppf(x),
        oppCost: derivative(x)

      };

      ppfSeries.push(point);
      x = x + .5;

    } while (ppf(x) >= 0);


    return {
      ppf: ppfSeries
    }

  }

}
