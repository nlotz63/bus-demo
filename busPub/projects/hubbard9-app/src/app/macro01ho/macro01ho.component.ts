import { Component, ElementRef, OnInit, signal, computed } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);
@Component({
  selector: 'app-macro01ho',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatSelectModule, MatFormFieldModule, FormsModule, MatButtonModule],
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
  deltaG0 = signal(0);
  potGDP = signal(19.2);
  mpc = signal(.75);
  options = signal({
    mpc: [.5, .6, .75, .8],
    pot: [19.2, 19.4, 19.6, 19.8, 20.0, 20.2]
  });
  cy = this.options().mpc[2];
  pot = this.options().pot[0];
  period = interval(1000);
  doReset = signal(false);
  buttonTitle = signal('Play');
  myInterval!: Subscription;

  graph = signal({
    title: 'Aggregate Expenditure',
    caption: '',
    xTitle: 'Real GDP, Y (trillions of 2017 dollars)',
    yTitle: 'Real aggregate expenditure, AE (tillions of 2017 dollars)',
    xMin: 18.4,
    xMax: 20.4,
    yMin: 18.4,
    yMax: 20.4,
  });

  modelParams = computed(() => {
    return {
      c0: 15.400001 - this.mpc() * 19.2,
      cy: this.mpc(),
      t0: 0,
      t1: 0,
      i0: 2.5,
      iy: 0,
      ir: 0,
      g0: 2.3,
      nx0: -1,
      potSeries: [[this.potGDP(), 0], [this.potGDP(), 22.2]
      ]
    }
  });

  simParams = computed(() => {
    return {
      g0: 2.3 + this.deltaG0() / 1000,

    }
  });

  tableProps = signal({
    round: 0,
    deltaG: 0,
    induced: 0,
    deltaY: 0,
    equation: ``,
    equation2: ``
  });

  equations = signal({
    equation1: ``,
    equation2: ``,
    deltaGDP: 0,
    multiplier: 0,
  });
  saveEq2 = ``;


  modelParams$ = toObservable(this.modelParams);

  constructor(private announcer: LiveAnnouncer, private el: ElementRef, private macroService: MacroModelService) { }

  ngOnInit(): void {
    this.macroService.setParamters(this.modelParams());
    this._setupGraph();
    this.modelParams$.subscribe((params) => {
      this.macroService.setParamters(params);
      this.updateGraph();
    });
  }
  public updateGraph() {
    const series = this.macroService.AEModel('AE');

    this.chart.update({
      series: [
        {
          type: 'line',
          name: 'AE',
          data: series.AE
        },
        {
          type: 'line',
          name: 'Initial AE',
          data: series.AE,
          label: { enabled: false }
        },
        {
          type: 'line',
          name: 'Potential GDP',
          data: this.modelParams().potSeries
        },
      ]
    });

  }

  public simulation() {
    if (this.buttonTitle() === 'Play') {
      this.buttonTitle.set('Reset');
    } else {
      this._reset();
      this.buttonTitle.set('Play');
      return;
    }
    let path = [19.2, 19.2], newEQ = [{ x: 19.2, y: 19.2, marker: { enabled: true } }], delta = 0, sum = 0, compMultiplier = 0;
    const gap = 1 / (1 - this.mpc()) * this.deltaG0();
    let eqCount = 0, equation1 = ``, equation2 = ``;

    this.myInterval = this.period.subscribe((count) => {
      eqCount = count;
      if (count === 0) {
        this.macroService.setParamters(this.simParams());
        const series = this.macroService.AEModel('AE');
        this.chart.series[0].setData(series.AE);
      }
      delta = Math.pow(this.modelParams().cy, count) * this.deltaG0() / 1000;
      compMultiplier = compMultiplier + Math.pow(this.modelParams().cy, count);
      sum = sum + delta*1000;
      let currentEQ = newEQ.map((el) => {
        return {
          x: el.x + delta,
          y: el.y + delta,
          marker: { enabled: true }
        }
      });

      if (gap - sum >= .3) {
        this._equationBuilder(count);
        equation2 = equation2 + `{${(this.mpc() ** count).toPrecision(2)}} + `;
        
      }
      newEQ = currentEQ;
      this.tableProps.set({
        round: count,
        deltaG: count === 0 ? this.deltaG0() : 0,
        induced: delta,
        deltaY: currentEQ[0].x,
        equation: `$$ ${this.deltaG0()} \\text{ billion} \\times \\sum_{i = ${count}}^{\\infty} {${(this.mpc()**count).toPrecision(2)}} = ${(sum).toFixed(0)} \\text{ billion} $$`,
        equation2: `$$ \\sum_{${eqCount}}^{\\infty} ${this.mpc()}^{${eqCount}} = ` + equation2 + `$$`
      });
      this.chart.series[3].setData(newEQ, true, false, false);
      if (gap - sum < .3) this.myInterval.unsubscribe();
    });

  }

  private _setupGraph() {
    const series = this.macroService.AEModel('AE');
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
        zooming: {
          type: 'xy'
        }
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
          const x = this.chart.plotWidth - .75 * w, y = h;
          return { x: x, y: y }
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
          name: 'AE',
          color: '#9F8F6D',
          lineWidth: 2,
          zIndex: 0,
          data: series.AE
        },
        {
          type: 'line',
          name: 'Initial AE',
          color: '#9F8F6D',
          lineWidth: 1,
          dashStyle: 'LongDash',
          zIndex: 0,
          data: series.AE,
          label: { enabled: false }
        },

        {
          type: 'line',
          name: 'Potential GDP',
          lineWidth: 1,
          color: 'black',
          zIndex: 1,
          data: this.modelParams().potSeries
        },
        {
          type: 'line',
          name: 'Equlibrium',
          lineWidth: 1,
          dashStyle: 'Dot',
          color: 'black',
          zIndex: 1,
          data: series.EQ,
          marker: { radius: 3, fillColor: 'rgb(235, 235, 235)', lineColor: 'black', lineWidth: 1 },
          label: { enabled: false }
        },
        {
          type: 'line',
          name: 'Y = AE',
          lineWidth: 1,
          color: 'black',
          data: [[0, 0], [26, 26]]
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: `${this.graph().xTitle}` },
        min: this.graph().xMin,
        max: this.graph().xMax,
        tickInterval: .2
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
        tickInterval: .2
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          label: { enabled: true, style: { fontSize: '.75em' } },
          animation: false
        }
      },

    });
    this._equationBuilder(null);
    this.tableProps.mutate((value) => {
      value.round = 0;
    });

  }

  private _reset() {
    this.myInterval.unsubscribe();
    this.mpc.set(.75);
    this.potGDP.set(19.2);
    this.cy = .75;
    this.pot = 19.2;
    this.deltaG0.set(0);
    this.macroService.setParamters(this.simParams());
    this.equations.mutate((value) => {
      value.multiplier = 0;
    });
    this._setupGraph();
  }

  private _equationBuilder(count: number | null) {
    const req = /\$/g;
    let eq1 = this.equations().equation1.replace(req, ''), eq2 = this.equations().equation2.replace(req, ''), deltaGDP = this.equations().deltaGDP, multiplier = this.equations().multiplier;

    multiplier = (multiplier + this.mpc() ** count!);
    deltaGDP = +(this.deltaG0() * multiplier).toFixed(0);
    if (count === null) {
      this.equations.mutate(value => {
        value.equation2 = `$$ \\sum_{i = 0}^{\\infty} \\text{mpc}^i = 1 + \\text{ mpc} + \\text{ mpc}^2 + \\text{ mpc}^3 + \\cdots = \\frac{1}{1- \\text{mpc}} $$`;
        value.equation1 = `$$ \\Delta G \\times \\text{multiplier} = \\Delta GDP $$`
      });
    }  else if(count <= 4) {
      eq1 = `${this.deltaG0()} \\times ${multiplier.toFixed(2)} = ${deltaGDP}`;
      let newEq2 = ``;
      for (let i = 0; i <= count; i++) {
        if (i < 4) {
          newEq2 = newEq2 + `${(this.mpc() ** i).toFixed(2)} + `;
        } else if (i === 4) {
          newEq2 = newEq2 + `\\cdots `;
          this.saveEq2 = newEq2;
        }
      }
      this.equations.set({
        equation1: `$$` + eq1 + `$$`,
        equation2: `$$` + `\\sum_{${count}}^{\\infty} ${this.mpc()}^{${count}} = ` + newEq2 +`= ${multiplier.toFixed(2)}` + `$$`,
        deltaGDP: this.deltaG0(),
        multiplier: multiplier,
      });

    } else {
      eq1 = `${this.deltaG0()} \\times ${multiplier.toFixed(2)} = ${(+multiplier.toFixed(2)*this.deltaG0()).toFixed(0)}`;
      this.equations.set({
        equation1: `$$` + eq1 + `$$`,
        equation2: `$$` + `\\sum_{${count}}^{\\infty} ${this.mpc()}^{${count}} = ` + this.saveEq2 + `= ${multiplier.toFixed(2)}` + `$$`,
        deltaGDP: this.deltaG0(),
        multiplier: multiplier,
          });

    }

  }
}
