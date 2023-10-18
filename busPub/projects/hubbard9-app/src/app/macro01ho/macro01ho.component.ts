import { Component, ElementRef, OnInit, signal, computed, ViewChild, AfterViewInit } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

export interface MultiplierData {
  round: number;
  autonomous: number;
  induced: number;
  total: number;
}

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);
@Component({
  selector: 'app-macro01ho',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatSelectModule, MatFormFieldModule, FormsModule, MatButtonModule, MatTabsModule, MatTableModule, MatPaginatorModule],
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


export class Macro01hoComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['round', 'autonomous', 'induced', 'total'];

  dataSource!: MatTableDataSource<MultiplierData>;
  data = [{ round: 1, autonomous: 2, induced: 2, total: 2 }];

  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator

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
    caption: 'The Y = AE line shows all the points where real GDP equals real aggregate expenditure. The slope of the AE curve is equal the marginal propensity to consume (MPC). To better visualize the movement toward a new equilibrium during the simulation, you can use your mouse to zoom in. Simply left-click and hold the mouse button and drag to form a rectangle around the area to enlarge.',
    xTitle: 'Real GDP, Y (trillions of 2017 dollars)',
    yTitle: 'Real aggregate expenditure, AE (tillions of 2017 dollars)',
    xMin: 18.4,
    xMax: 20.4,
    yMin: 18.5,
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
      xMin: 18.4,
      xMax: 20.4,
      potSeries: [[this.potGDP(), 18.4], [this.potGDP(), 22.2]
      ]
    }
  });

  simParams = computed(() => {
    return {
      g0: 2.3 + this.deltaG0() / 1000,

    }
  });

  equations = signal({
    equation1: ``,
    equation2: ``,
    deltaGDP: 0,
    multiplier: 0,
  });
  saveEq2 = ``;

  disableInput = signal(false);
  enablePlay = computed(() => this.potGDP() !== 19.2 ? false : true);

  modelParams$ = toObservable(this.modelParams);

  constructor(private announcer: LiveAnnouncer, private el: ElementRef, private macroService: MacroModelService) {
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngOnInit(): void {
    this.macroService.setParamters(this.modelParams());
    this._setupGraph();
    this.modelParams$.subscribe((params) => {
      this.macroService.setParamters(params);
      this.updateGraph();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
      this.disableInput.set(true);
    } else {
      this._reset();
      this.buttonTitle.set('Play');
      return;
    }
    let newEQ = [{ x: 0, y: 19.2 }, { x: 19.2, y: 19.2, marker: { enabled: true } }, {x: 19.2, y: 18.4}], delta = 0, sum = 0, compMultiplier = 0;
    const gap = 1 / (1 - this.mpc()) * this.deltaG0();

    this.myInterval = this.period.subscribe((count) => {
      if (count === 0) {
        this.macroService.setParamters(this.simParams());
        const series = this.macroService.AEModel('AE');
        this.chart.series[0].setData(series.AE);
      }
      delta = Math.pow(this.modelParams().cy, count) * this.deltaG0() / 1000;
      compMultiplier = compMultiplier + Math.pow(this.modelParams().cy, count);
      sum = sum + delta * 1000;
      let currentEQ = newEQ.map((el, indx) => {
        switch (indx) {
          case 0:
            return { x: 0, y: el.y + delta}
          case 1:
            return {
              x: el.x + delta,
              y: el.y + delta,
              marker: { enabled: true }
            }
          default:
            return { x: el.x + delta, y: 18.4 }
        }
      });

      if (gap - sum > .004) {
        this._equationBuilder(count);
        this._readerMessage(count, false);

      } else {
        const req = /\$/g;
        let eq2 = this.equations().equation2.replace(req, '')
        this.myInterval.unsubscribe();
        this.equations.mutate((value) => {
          value.equation2 = '$$' + eq2 + ` = \\frac{1}{(1- ${this.mpc()})} $$`;
        });
        this._readerMessage(count, true);
      }
      newEQ = currentEQ;
      this.chart.series[3].setData(newEQ, true, false, false);
    });

  }

  private _setupGraph() {
    const series = this.macroService.AEModel('AE');
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart(container, {
      chart: {
        height: 625,
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
        style: { textAlign: 'right' }
      },
      accessibility: {
        point: {
          valueDescriptionFormat: `real GDP, Y: {point.x:.1f} trillion dollars, aggregate expenditure, AE: {point.y:.1f} trillion dollars.`
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
          zIndex: -1,
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
          data: [[18.4, 18.4], [20.4, 20.4]]
        },
        {
          type: 'line',
          name: 'Initial Equlibrium',
          lineWidth: 1,
          dashStyle: 'Dot',
          color: 'black',
          zIndex: 1,
          data: series.EQ,
          marker: { radius: 3, fillColor: 'rgb(235, 235, 235)', lineColor: 'black', lineWidth: 1 },
          label: { enabled: false }
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
          animation: false,
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: `Y: \${point.x:.1f} trillion<br/>AE: \${point.y:.1f} trillion`

          }
        }
      },

    });
    this._equationBuilder(null);

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
    this.data = [];
    this.dataSource.data = this.data;
    this.disableInput.set(false);
    this._setupGraph();
  }

  private _equationBuilder(count: number | null) {
    const req = /\$/g;
    let eq1 = this.equations().equation1.replace(req, ''), eq2 = this.equations().equation2.replace(req, ''), deltaGDP = this.equations().deltaGDP, multiplier = this.equations().multiplier;

    if (count !== null) multiplier = multiplier + Math.pow(this.mpc(), count!);

    deltaGDP = +(this.deltaG0() * multiplier).toFixed(0);
    if (count === null) {
      this.data = []
      this.dataSource.data = this.data;
      this.equations.mutate(value => {
        value.equation2 = `$$ \\sum_{i = 0}^{\\infty} \\text{mpc}^i = 1 + \\text{ mpc} + \\text{ mpc}^2 + \\text{ mpc}^3 + \\cdots = \\frac{1}{1- \\text{mpc}} $$`;
        value.equation1 = `$$ \\Delta G \\times \\text{multiplier} = \\Delta Y $$`
      });
    } else if (count <= 4) {
      eq1 = `\$${this.deltaG0()} \\text{ billion } \\times ${multiplier.toFixed(2)} = \$${deltaGDP} \\text{ billion }`;
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
        equation2: `$$` + `\\sum_{${count}}^{\\infty} ${this.mpc()}^{${count}} = ` + newEq2 + `= ${multiplier.toFixed(2)}` + `$$`,
        deltaGDP: this.deltaG0(),
        multiplier: multiplier,
      });

    } else {
      eq1 = `\$${this.deltaG0()} \\text{ billion } \\times ${multiplier.toFixed(2)} = \$${(+multiplier.toFixed(2) * this.deltaG0()).toFixed(0)} \\text{ billion }`;
      this.equations.set({
        equation1: `$$` + eq1 + `$$`,
        equation2: `$$` + `\\sum_{${count}}^{\\infty} ${this.mpc()}^{${count}} = ` + this.saveEq2 + `= ${multiplier.toFixed(2)}` + `$$`,
        deltaGDP: this.deltaG0(),
        multiplier: multiplier,
      });

    }
    // build the table
    if (count !== null && count >= 0) {
      this.data.push(
        {
          round: count + 1,
          autonomous: count === 0 ? this.deltaG0() : 0,
          induced: count > 0 ? +(this.mpc() ** count * this.deltaG0()) : 0,
          total: +(multiplier * this.deltaG0()),
        }
      );
      this.dataSource.data = this.data;
      this.table.renderRows();
      this.paginator.lastPage();
    }
  }

  private _readerMessage(count: number, stop: boolean) {
    let message = ``, feedback1 = '';
    const gap = (this.potGDP() - 19.2) * 1000, multiplier = 1 / (1 - this.cy),
      urDeltaG = this.deltaG0(), reqDeltaG = +(gap / multiplier).toFixed(2);

    if (urDeltaG === reqDeltaG) {
      feedback1 = 'Congratulations!'
    } else {
      feedback1 = urDeltaG < reqDeltaG ? 'Unfortunately, you didn\'t increase spending enough.' : 'Unfortunately, you increased spending too much.';
    }

    if (count === 0 && !stop) {
      message = `The simulation has started. The graph, table, and math will update every second until the new equilibrium is reached. A point on the Y equals AE line will move up along the line toward potential GDP. An announcement at the end of the simulation will let you know how you did. Depending on your choices, the simulation can take up to a minute and a half to complete.`
    } else if (count > 0 && stop) {
      message = `The simulation has ended. To restore full employment you needed to increase real GDP by ${reqDeltaG} billion dollars, you increased government spending by ${urDeltaG} billion dollars. ${feedback1}`;
    } else { return; }

    this.announcer.announce(message);
  }
}
