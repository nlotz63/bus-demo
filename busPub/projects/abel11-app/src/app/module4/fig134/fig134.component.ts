import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';
import { interval } from 'rxjs';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';

HC_export(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-fig134',
  templateUrl: './fig134.component.html',
  styleUrls: ['./fig134.component.scss'],
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
export class Fig134Component implements OnInit, AfterViewInit {

  mode: number = 0;
  showScenario: boolean = true;
  showPlayer: boolean = false;
  chart!: Highcharts.Chart;
  buttonTitle: string = 'Play';
  simulationInterval = interval(200);

  shiftDemand = 0;
  shiftSupply = 0;

  scenarioGroup = new FormGroup({
    scenario: new FormControl(''),
    direction: new FormControl('1')
  });

  scenarioData = [
    [
      {
        title: `An increase in domestic income`,
        demandShift: 0,
        supplyShift: 0,
        text: `I wonder if this text will automagically wrap at the end of the line or will it just continue on and on and on and on on a single line.`
      }
    ],
    [
      {
        title: `A decrease in domestic income`,
        demandShift: 0,
        supplyShift: 0,
        text: ``
      }

    ]

  ];


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this.scenarioGroup.valueChanges.subscribe((el) => {
      console.log(el);
    });
    this._createSeries(false);
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);
  }

  //public methods

  public playStep(value: number) {
    this.mode = value;
    this._setupChart(true);

  }

  public updateChart(value: any) {
    let series = this._createSeries(false);
    this.chart.series[0].setData(series.demand, false, false, false);
    this.chart.series[1].setData(series.supply, false, false, false);
    this.chart.series[2].setData(series.eq, true, false, false);

  }

  public runSimulation() {
    if (this.buttonTitle === 'Reset') {
      this._reset();
      return;
    }
    // Maniuplate shift paramters and then call update chart. Do this at 200msec intervals until new equilibrium.
    this.simulationInterval.subscribe(() => {
      this.shiftDemand += .05;
      console.log(this.shiftDemand);
      this.updateChart('test');
    });

    this.buttonTitle = 'Reset';
  }

  // private methods

  private _setupChart(addRef: boolean) {
    let series = this._createSeries(addRef);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 500,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Market for dollars' },
      legend: { enabled: false },
      series: [
        {
          type: 'spline',
          name: 'Demand',
          zIndex: 0,
          animation: false,
          data: series.demand,
          label: {
            useHTML: true,
            format: 'Demand'
          }
        },
        {
          type: 'spline',
          name: 'Supply',
          zIndex: 0,
          animation: false,
          data: series.supply,
          label: {
            useHTML: true,
            format: 'Supply'
          }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          animation: false,
          dashStyle: 'Dot',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: 1,
          data: series.eq,
          label: {
            enabled: false
          }
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1,
        tickColor: '#757575',
        min: 0,
        max: 65,
        title: { useHTML: true, text: 'Number of dollars in foreign exchange market</sup>' },

      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        tickInterval: .25,
        min: 0,
        max: 2,
        title: { useHTML: true, text: 'Value of U.S. dollar, <i>e</i><sub>nom</sub>' },

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          color: '#C31229',
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Real interest rate: {point.y:.2f}%'
          },
          label: {
            style: { fontWeight: '400' }
          }
        }
      }
    });
  }

  private _createSeries(addRef: boolean) {
    let demand: any[] = [], supply: any[] = [], eq: any[] = [];
    let epsilon = .00001, count = 0;

    // model parameters
    let dShift = this.shiftDemand, demandConst = 1.75 + dShift, demandSlope = .07, exp = .75, x = 0;
    let sShift = this.shiftSupply, supplyConst = .35 + sShift, supplySlope = 0.0031, expS = 1.5;

    let demandFunc = (x: number) => {
      return demandConst - demandSlope * Math.pow(x, exp);
    }
    let supplyFunc = (x: number) => {
      return supplyConst + supplySlope * Math.pow(x, expS);
    }

    let findEq = () => {
      let xLower = 0, xUpper = 60, xMid = (xUpper + xLower) / 2;
      let difference = 10;

      do {
        difference = demandFunc(xMid) - supplyFunc(xMid);

        if (difference > 0) {
          xLower = xMid;
        } else {
          xUpper = xMid;
        }
        xMid = (xLower + xUpper) / 2;
        count++;
      } while (Math.abs(difference) > epsilon && count < 100);

      return xMid;

    }

    do {
      let point = {
        name: 'demand',
        x: x,
        y: demandFunc(x)
      }
      let point2 = {
        name: 'supply',
        x: x,
        y: supplyFunc(x)
      }
      demand.push(point);
      supply.push(point2);
      x = x + .5;

    } while (x <= 60);

    let eqX = findEq();

    eq = [
      {
        x: 0,
        y: demandFunc(eqX),
        marker: { enabled: false, radius: 0 }
      },
      {
        x: eqX,
        y: demandFunc(eqX),
        marker: { enabled: true, fillColor: 'orange', lineColor: 'black', lineWidth: 1, radius: 4, symbol: 'circle' }
      },
      {
        x: eqX,
        y: 0,
        marker: { enabled: false, radius: 0 }

      }
    ];


    return {
      demand: demand,
      supply: supply,
      eq: eq
    }

  }

  private _reset() {
    this.showScenario = false;
    this.scenarioGroup.setValue({
      scenario: '',
      direction: '1'
    });
    this.buttonTitle = 'Play';
  }

}
