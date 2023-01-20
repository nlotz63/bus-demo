import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_annotate from 'highcharts/modules/annotations';
import HC_seriesLabel from 'highcharts/modules/series-label';
import { LiveAnnouncer } from '@angular/cdk/a11y';

HC_accessibility(Highcharts);
HC_annotate(Highcharts);
HC_seriesLabel(Highcharts);

@Component({
  selector: 'app-production-function',
  templateUrl: './production-function.component.html',
  styleUrls: ['./production-function.component.scss']
})
export class ProductionFunctionComponent implements OnInit, AfterViewInit {
  chart!: Highcharts.Chart;

  //model properties
  N = 157.5;
  K = 23539;
  A = 25.99;
  alpha = 0.3;
  slope = 2.138079871234851;
  prevN!: number;
  prevK!: number;
  prevA = this.A;

  // set conditions properties
  @Input() mode = 0;
  steps = 4;
  showPlayer = false;


  config = [
    {
      plotLabor: false,
      plotSlopes: false,
      xTitle: 'Capital stock, K (billions of chained 2012 dollars)',
      yTitle: 'Output, Y (billions of chained 2012 dollars)',
      xTick: 2000,
      xMax: undefined,
      yMax: undefined

    },
    {
      plotLabor: false,
      plotSlopes: true,
      xTitle: 'Capital stock, K (billions of chained 2012 dollars)',
      yTitle: 'Output, Y (billions of chained 2012 dollars)',
      xTick: 2000,
      xMax: 24000,
      yMax: 20000

    },
    {
      plotLabor: true,
      plotSlopes: true,
      xTitle: 'Labor, N (millions of workers)',
      yTitle: 'Output, Y (billions of chained 2012 dollars)',
      xTick: 25,
      xMax: undefined,
      yMax: undefined


    },
    {
      plotLabor: true,
      plotSlopes: true,
      xTitle: 'Labor, N (millions of workers)',
      yTitle: 'Output, Y (billions of chained 2012 dollars)',
      xTick: 25,
      xMax: 150,
      yMax: 20000


    }



  ]

  // Graph properties
  seriesData: any[] = [];
  // template properties
  lowerX = 0;
  centerPoint = 3000;
  upperX = 0
  lowerY = 0
  centerY = 0;
  upperY = 0;
  diff1 = 1134.9266982645531;
  diff2 = 893.1999437257073;

  constructor(
    private activeRoute: ActivatedRoute,
    private announcer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;

    });
    this.createSeries();

    // set initial values for template props

    switch (this.mode) {
      case 0:
        this.centerPoint = 3000;
        this.prevK = 3000;

        break;
      case 1:
        this.slope = 2.138079871234851;
        this.centerPoint = 1000;
        this.prevK = 1000;

        break;
      case 2:
        this.slope = 151.75105655051237;
        this.centerPoint = 20;
        this.prevN = 20;
        break;
      case 3:

        break;
      default:
        break;
    }

  }

  ngAfterViewInit(): void {
  //  this.chart = new Highcharts.Chart( 'container', this.chart1 );
    this._setupChart();
  }

  public playStep(value: any) {
    this.mode = value;
    this.chart.destroy();
    this.createSeries();
    switch (this.mode) {
      case 0:
        this.centerPoint = 3000;
        this.prevK = 3000;

        break;
      case 1:
        this.slope = 2.138079871234851;
        this.centerPoint = 1000;
        this.prevK = 1000;

        break;
      case 2:
        this.slope = 151.75105655051237;
        this.centerPoint = 20;
        this.prevN = 20;
        break;
      case 3:

        break;
      default:
        break;
    }
     this._setupChart();

  }

  private _setupChart() {

    this.chart = new Highcharts.Chart('container', {
      chart: {
        type: 'spline',
        animation: false,
        height: 550

      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {text: 'Production Function'},
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          events: {
            click: (e: any) => {
             if( this.mode === 1 || this.mode === 2) this.plotTangent(this.chart.xAxis[0].toValue(e.chartX));
            }
          },
          animation: false,
          name: 'Production function',
          data: this.seriesData,
          tooltip: {
            headerFormat: '<b>Production Function</b><br/>',
            pointFormat: `Capital: {point.x:,.2f}<br/>Output: {point.y:,.2f}<br/>Marginal product: {point.slope:.2f}`
          },
          lineWidth: 1.5,
          states: {hover: {enabled: false}}
        },

      ],
      xAxis: {
        lineColor: 'black',
        lineWidth: 1.5,
        tickColor: 'black',

        title: {text: this.config[this.mode].xTitle},
        tickInterval: this.config[this.mode].xTick,
        max: this.config[this.mode].xMax
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: 'black',
        lineWidth: 1.5,
        tickColor: 'black',
        tickWidth: 1,
        title: {text: this.config[this.mode].yTitle},
        tickInterval: 2000,
        max: this.config[this.mode].yMax
      },
      plotOptions: {
        series: {
          animation: false
        }
      },
      annotations: [{
        labels: []
      }]

    });
    switch (this.mode) {
      case 0:
        this.plotDimMarginal(3000,true);
        break;
      case 1:
        this.plotTangent(1000, true);
        break;
      case 2:
        this.plotTangent(20, true);
        break;
      case 3:
        this.shiftPf(this.A, true);
        break;

      default:
        break;
    }

  }


  private createSeries() {
    this.seriesData = [];
    let x = 0;
    let max = this.config[this.mode].plotLabor ? this.N + 1 : this.K, step = max/200;

    do {
      let point = {};
      let productionFunction = this.config[this.mode].plotLabor ? this._computePF( this.A, this.K, x ) : this._computePF(this.A, x, this.N);
      point = {x: x, y: productionFunction[0], slope: productionFunction[1]};
      this.seriesData.push(point);
      x += step;

    } while (x <= max);

  }
  public plotTangent(tanX1: any, addSeries?: boolean) {
    tanX1 = typeof tanX1 === 'object' ? Number(tanX1.target.value) : tanX1;
    let tanValues = this.config[this.mode].plotLabor ? this._computePF( this.A, this.K, tanX1 ) : this._computePF(this.A, tanX1, this.N);
    let deltaX = this.mode === 1 ? 2000 : 20;
    let xLabel = this.config[this.mode].plotLabor ? 'Labor' : 'Captial', mpLabel = this.config[this.mode].plotLabor ? 'MPL' : 'MPK', xUnit = this.config[this.mode].plotLabor ? 'million workers' : 'billions';
    this.slope = tanValues[1];
    this.centerPoint = tanX1;

    if (addSeries) {
      this.chart.addSeries(
        {
          type: 'line',
          name: 'Tangent line',
          data: [],
          tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: `${xLabel}: {point.x:.2f} ${xUnit}<br/>Output, Y: \${point.y:.2f} billions<br/>
            ${mpLabel}: {point.z:.2f}`,
          },
          states: { hover: { enabled: false } },
          lineWidth: 1,
          color: 'black',
          marker: {enabled: false}
        }

      );
      this.chart.series[0].update({
        type: 'spline',
        tooltip: {
          headerFormat: '<b>Production Function</b><br/>',
          pointFormat: `${xLabel}: {point.x:,.2f} ${xUnit}<br/>Output: \${point.y:,.2f} billion<br/>${mpLabel}: {point.slope:.2f} billion`

        }
      });

      if (this.mode === 2) {
        this.chart.addSeries(
          {
            type: 'line',
            name: '2020 Actual Output',
            lineWidth: 1,
            color: 'darkgrey',
            dashStyle: 'Dot',
            states: {
              hover: {enabled: false}
            },
            data: [
              [0, 18385],
              { name: 'point', x: 157.5, y: 18385, color: 'blue', marker: { enabled: true, radius: 3, symbol: 'circle'}},
              [157.5, 18385],
              [157.5, 0]

            ],
          }
        );
        this.chart.update({
          annotations: [{
            labels: [
              {

                point: { x: 157.5, y: 18385, xAxis: 0, yAxis: 0 },
                text: 'A'
              },
            ],
            labelOptions: {x: -8, y: -2, backgroundColor: 'white', borderWidth: 0, padding: 0}
          }]
        });
      }
    }
    this.chart.series[1].setData(
        [
          [tanX1-deltaX, tanValues[0] + tanValues[1]*(-deltaX)],
          {x: tanX1, y: tanValues[0], z: this.slope, color: 'blue', marker: {enabled: true, symbol: 'circle', radius: 3}},
          [tanX1+ deltaX, tanValues[0] + tanValues[1]*(deltaX)]
        ]
    );

  }

  public plotDimMarginal(centerPoint: any, addSeries?: boolean) {
    centerPoint =  typeof centerPoint === 'object' ? Number(centerPoint.target.value) : centerPoint;
    let lowerX = centerPoint - 1000, upperX = centerPoint + 1000,
      centerY = this._computePF(this.A, centerPoint, this.N)[0], lowerY = this._computePF(this.A, lowerX, this.N)[0], upperY = this._computePF(this.A, upperX, this.N)[0];

    this.lowerX = lowerX, this.centerPoint = centerPoint, this.upperX = upperX,
      this.lowerY = lowerY, this.centerY = centerY, this.upperY = upperY,
      this.diff1 = centerY - lowerY, this.diff2 = upperY - centerY;

    if (addSeries) {
      this.chart.addSeries({

          type: 'line',
          name: '',
          color: 'darkgrey',
          lineWidth: 1,
          dashStyle: 'Dot',
          marker: {
            symbol: 'circle'
          },
          states: {
            hover: { enabled: false }
          },
        data: [],
        tooltip: {
          headerFormat: '<b>Point B</b><br>',
          pointFormat: 'Capital: ${point.x:,.2f} billion<br/>Output: ${point.y:,.2f} billion'
          }
      }, false);
      this.chart.addSeries(
        {
          type: 'line',
          name: '',
          color: 'darkgrey',
          lineWidth: 1,
          dashStyle: 'Dot',
          marker: {
            symbol: 'circle',
            enabled: false,
          },
          states: {
            hover: {enabled: false}
          },
          data: [],
          tooltip: {
            headerFormat: '<b>Point C</b><br>',
            pointFormat: 'Capital: ${point.x:,.2f} billion<br/>Output: ${point.y:,.2f} billion'
            }
        },
        false
      );
      this.chart.addSeries(
        {
          type: 'line',
          name: '',
          color: 'darkgrey',
          lineWidth: 1,
          dashStyle: 'Dot',
          marker: {
            symbol: 'circle'
          },
          states: {
            hover: {enabled: false}
          },
          data: [],
          tooltip: {
            headerFormat: '<b>Point D</b><br>',
            pointFormat: 'Capital: ${point.x:,.2f} billion<br/>Output: ${point.y:,.2f} billion'
            }

        },
        false
      );
      this.chart.addSeries(
        {
          type: 'line',
          name: '2020 Actual Output',
          color: 'darkgrey',
          lineWidth: 1,
          dashStyle: 'Dot',
          marker: {
            symbol: 'circle'
          },
          states: {
            hover: {enabled: false}
          },
          data: [],
          tooltip: {
            headerFormat: '<b>Point A</b><br>',
            pointFormat: 'Capital: ${point.x:,.2f} billion<br/>Output: ${point.y:,.2f} billion'
            }

        },
        false
      );

    }

    this.chart.series[1].setData([
      [0, lowerY],
      { name: 'point', x: lowerX, y: lowerY, color: 'blue', marker: { enabled: true, radius: 3, symbol: 'circle'}},
      [lowerX, lowerY],
      [lowerX, 0]
    ]);
    this.chart.series[2].setData([
      [0, centerY],
      { name: 'point', x: centerPoint, y: centerY, color: 'blue', marker: { enabled: true, radius: 4, symbol: 'circle', fillColor: 'orange'}, label: 'Capture'},
      [centerPoint, centerY],
      [centerPoint, 0]
    ]);
    this.chart.series[3].setData([
      [0, upperY],
      { name: 'point', x: upperX, y: upperY, color: 'blue', marker: { enabled: true, radius: 3, symbol: 'circle'}},
      [upperX, upperY],
      [upperX, 0]
    ]);
    this.chart.series[4].setData([
      [0, 18385],
      { name: 'point', x: 23539, y: 18385, color: 'blue', marker: { enabled: true, radius: 3, symbol: 'circle'}},
      [23539, 18385],
      [23539, 0]
    ]);

    this.chart.update({
      annotations: [{
        labels: [{

          point: { x: lowerX, y: lowerY, xAxis: 0, yAxis: 0 },
          text: 'B'
        },
        {

          point: { x: centerPoint, y: centerY, xAxis: 0, yAxis: 0 },
          text: 'C'
          },
          {

            point: { x: upperX, y: upperY, xAxis: 0, yAxis: 0 },
            text: 'D'
          },
          {

            point: { x: 23539, y: 18385, xAxis: 0, yAxis: 0 },
            text: 'A'
          },
        ],
        labelOptions: {x: -8, y: -2, backgroundColor: 'white', borderWidth: 0, padding: 0}
      }]
    }, true);



  }
  public shiftPf(A: any, reference?: boolean) {
    A = typeof A === 'object' ? Number(A.target.value) : A;
    let x = 0;
    let max = this.config[this.mode].plotLabor ? this.N + 1 : this.K, step = max / 200;
    this.seriesData = [];

    let xLabel = 'Labor', mpLabel = 'marginal product of labor';


    do {
      let point = {};
      let productionFunction = this._computePF( A, this.K, x );
      point = {x: x, y: productionFunction[0], slope: productionFunction[1]};
      this.seriesData.push(point);
      x += step;

    } while (x <= max);
    this.chart.series[0].setData(this.seriesData, true);
    if (reference) {
      let referenceSeries = this.seriesData;
      this.chart.addSeries({
        type: 'spline',
        name: 'Reference production function',
        lineWidth: 1,
        zIndex: 0,
        visible: false,
        color: 'grey',
        dashStyle: 'Dash',
        data: referenceSeries
      });
      this.chart.series[0].update({
        type: 'spline',
        tooltip: {
          headerFormat: '<b>Production Function</b><br/>',
          pointFormat: `${xLabel}: {point.x:,.2f} million workers<br/>Output: \${point.y:,.2f} billion<br/>${mpLabel}: {point.slope:.2f}`

        }
      });
    }
    if (A < 25.95) {
      this.chart.series[1].setVisible(true, false);
    } else if (A >= 25.95) {
      this.chart.series[1].setVisible(false, false);
    }




  }

  private _computePF(A: number, K: number, N: number) {
    let productionFunction = A* Math.pow(K, this.alpha) * Math.pow(N, 1- this.alpha);
    let marginalProduct = this.config[this.mode].plotLabor ? (1-this.alpha)*A* Math.pow(N, -this.alpha)*Math.pow(K, this.alpha) : this.alpha*A*Math.pow(K, this.alpha - 1)*Math.pow(N, 1-this.alpha);
    return [productionFunction, marginalProduct];
  }

  public messageBuilder(value: any) {
    value = Number(value.target.value);
    let message: string = ``;

    switch (this.mode) {
      case 0:
        if (this.prevK <= value) {
          message = `Points B, C, and D have moved up along the production function. Refer to the summary table for details on changes in capital and output between these points.`;
        } else {
          message = `Points B, C, and D have moved down along the production function. Refer to the summary table for details on changes in capital and output between these points.`;
        }
        this.prevK = value;
        break;
      case 1:
        if (this.prevK <= value) {
          message = `The tangent line has moved up along the production function and has become flatter, indicating a lower marginal product of capital.`;
        } else {
          message = `The tangent line has moved down along the production function and has become steeper, indicating a higher marginal product of capital.`;
        }
        this.prevK = value;
        break;
      case 2:
        if (this.prevN <= value) {
          message = `The tangent line has moved up along the production function and has become flatter, indicating a lower marginal product of labor.`;
        } else {
          message = `The tangent line has moved down along the production function and has become steeper, indicating a higher marginal product of labor.`;
        }
        this.prevN = value;
        break;
      case 3:
        if (this.prevA <= value) {
          message = `A beneficial supply shock has shifted the production function upward.`;
        } else {
          message = `An adverse supply shock has shifted the production function downward.`;
        }
        this.prevA = value;
        break;

      default:
        break;
    }

    this.announcer.announce(message);
  }
}
