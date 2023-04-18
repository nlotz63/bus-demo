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
  showScenario: boolean = false;
  showPlayer: boolean = false;
  chart!: Highcharts.Chart;
  buttonTitle: string = 'Play';
  buttonDisabled: boolean = true;
  selectionDisabled: boolean = false;
  simulationInterval = interval(200);
  subscription!: any;

  shiftDemand = 0;
  shiftSupply = 0;

  demandRef!: any[];
  supplyRef!: any[];
  eqRef!: any[];

  scenarioGroup = new FormGroup({
    scenario: new FormControl(''),
    direction: new FormControl('')
  });

  scenarioData = [
    [
      {
        title: `An increase in domestic income`,
        demandShift: 0,
        supplyShift: -0.01,
        text: `Higher domestic output raises demand for imports and increases supply of domestic currency. This is shown in the graph as a rightward shift of the supply curve.`
      },
      {
        title: `A decrease in domestic income`,
        demandShift: 0,
        supplyShift: 0.01,
        text: `Lower domestic output decreases demand for imports and decreases supply of domestic currency. This is shown in the graph as a leftward shift of the supply curve.`
      }
    ],
    [
      {
        title: `An increase in foreign income`,
        demandShift: 0.01,
        supplyShift: 0,
        text: `Higher foreign output raises demand for exports and increases demand for domestic currency. This is shown in the graph as a rightward shift of the demand curve.`
      },
      {
        title: `A decrease in foreign income`,
        demandShift: -0.01,
        supplyShift: 0,
        text: `Lower foreign output lowers demand for exports and decreases demand for domestic currency. This is shown in the graph as a leftward shift of the demand curve.`
      }
    ],
    [
      {
        title: `An increase in the domestic real interest rate`,
        demandShift: 0.01,
        supplyShift: 0.01,
        text: `Higher real interest rate makes domestic assets more attractive and increases demand and decreases supply of domestic currency. This is shown in the graph as a rightward shift of the demand curve and a leftward shift of the supply curve.`
      },
      {
        title: `A decrease in the domestic real interest rate`,
        demandShift: -0.01,
        supplyShift: -0.01,
        text: `Lower real interest rate makes domestic assets less attractive and decreases demand and increases supply of domestic currency. This is shown in the graph as a leftward shift of the demand curve and a rightward shift of the supply curve.`
      }
    ],
    [
      {
        title: `An increase in the foreign real interest rate`,
        demandShift: -0.01,
        supplyShift: -0.01,
        text: `Higher foreign real interest rate makes foreign assets more attractive and increases supply and decreases demand for domestic currency. This is shown in the graph as a rightward shift of the supply curve and a leftward shift of the demand curve.`
      },
      {
        title: `A decrease in the foreign real interest rate`,
        demandShift: 0.01,
        supplyShift: 0.01,
        text: `Lower foreign real interest rate makes foreign assets less attractive and decreases supply and increases demand for domestic currency. This is shown in the graph as a leftward shift of the supply curve and a rightward shift of the demand curve.`
      }
    ],
    [
      {
        title: `An increase in the world demand for domestic goods`,
        demandShift: 0.01,
        supplyShift: 0.01,
        text: `Higher demand for domestic goods increases foreign demand for domestic currency and reduces supply of domestic currency in foreign exchange market. This is shown in the graph as a rightward shift of the demand curve and a leftward shift of the supply curve.`
      },
      {
        title: `A decrease in the world demand for domestic goods`,
        demandShift: -0.01,
        supplyShift: -0.01,
        text: `Lower demand for domestic goods decreases foreign demand for domestic currency and increases supply of domestic currency in foreign exchange market. This is shown in the graph as a leftward shift of the demand curve and a rightward shift of the supply curve.`
      }
    ],
  ];


  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
    this.scenarioGroup.valueChanges.subscribe((el) => {
      this.buttonDisabled = el.direction !== '' && el.scenario !== '' ? false : true;
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

  public updateChart() {
    let series = this._createSeries(false);
    this.chart.series[0].setData(series.demand, false, false, false);
    this.chart.series[1].setData(series.supply, false, false, false);
    this.chart.series[2].setData(series.eq, true, false, false);

  }

  public runSimulation() {
    if (this.buttonTitle === 'Reset') {
      this._reset();
      this.subscription.unsubscribe();
      return;
    }
    this.announcer.announce('The simulation started', 'assertive');

    // set up simulation
    let scenario = Number(this.scenarioGroup.value.scenario), direction = Number(this.scenarioGroup.value.direction);
    let demandShift = 0, supplyShift = 0;

    supplyShift = this.scenarioData[scenario][direction].supplyShift;
    demandShift = this.scenarioData[scenario][direction].demandShift

    // Maniuplate shift paramters and then call update chart. Do this at 200msec intervals until new equilibrium.
    this.subscription = this.simulationInterval.subscribe(() => {
      this.shiftDemand += demandShift;
      this.shiftSupply += supplyShift;
      if (Math.abs(this.shiftDemand) > .4 || Math.abs(this.shiftSupply) > .4) {
        this.subscription.unsubscribe();
        this.announcer.announce('The simulation ended', 'polite');

      }

      this.updateChart();
    });
    this.showScenario = true;
    this.selectionDisabled = true;
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
      accessibility: {
        point: {
          descriptionFormatter: (point): any => {
            return 'Nominal exchange rate equals ' + point.y?.toFixed(2) + ' Quantity equals ' + point.x?.toFixed(0) + ' billion.';
          },
        }
      },
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
          },
          accessibility: {description: 'A downward sloping curve. It intersects the supply curve.'}
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
          },
          accessibility: {description: 'An upward sloping curve. It intersects the demand curve.'}
        },
        {
          type: 'line',
          name: 'Equilibrium',
          animation: false,
          dashStyle: 'Dot',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: 2,
          data: series.eq,
          label: {
            enabled: false
          },
          accessibility: {description: `A point indicating the equilibrium nominal exchange rate and quantity.`}
        },
        {
          type: 'spline',
          name: 'Initial Demand',
          animation: false,
          zIndex: -1,
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          data: series.demandRef,
          label: {enabled: false}
        },
        {
          type: 'spline',
          name: 'Initial Supply',
          animation: false,
          zIndex: -1,
          dashStyle: 'Dash',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          data: series.supplyRef,
          label: {enabled: false}
        },
        {
          type: 'line',
          name: 'Initial equilibrium',
          animation: false,
          dashStyle: 'Dot',
          color: 'rgb(112, 112, 112)',
          lineWidth: 1,
          zIndex: 1,
          data: series.eqRef,
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
          marker: {enabled: false },
          tooltip: {
            headerFormat: '{series.name}<br/>',
            pointFormat: 'Quantity: ${point.x:.0f} billion<br/>Nominal exchange rate: {point.y:.2f}'
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
      x = x + 2;

    } while (x <= 65);

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
        marker: { enabled: true, fillColor: 'orange', lineColor: 'black', lineWidth: 1, radius: 4, symbol: 'circle' },
        accessibility: {
          description: `The equilibrium quantity is ${eqX} and the equilibrium nominal exchange rate is ${demandFunc(eqX)}.`,
          valueDecimals: 2
        },
      },
      {
        x: eqX,
        y: 0,
        marker: { enabled: false, radius: 0 }

      }
    ];





    if (addRef) {
      this.demandRef = demand;
      this.supplyRef = supply;
      this.eqRef = [
        {
          x: 0,
          y: demandFunc(eqX),
          marker: { enabled: false, radius: 0 }
        },
        {
          x: eqX,
          y: demandFunc(eqX),
          marker: { enabled: true, fillColor: 'rgb(112, 112, 112)', lineColor: 'black', lineWidth: 1, radius: 3, symbol: 'circle' }
        },
        {
          x: eqX,
          y: 0,
          marker: { enabled: false, radius: 0 }

        }
      ];
    }


    return {
      demand: demand,
      supply: supply,
      eq: eq,
      demandRef: this.demandRef,
      supplyRef: this.supplyRef,
      eqRef: this.eqRef,

    }

  }

  private _reset() {
    this.showScenario = false;
    this.scenarioGroup.setValue({
      scenario: '',
      direction: ''
    });
    this.shiftDemand = 0;
    this.shiftSupply = 0;
    this.updateChart();
    this.selectionDisabled = false;
    this.buttonTitle = 'Play';
    this.announcer.announce('The simulation has been reset.');
  }

}
