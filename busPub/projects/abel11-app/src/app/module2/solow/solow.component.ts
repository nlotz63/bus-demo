import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


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
  selector: 'app-solow',
  templateUrl: './solow.component.html',
  styleUrls: ['./solow.component.scss'],
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
  ]
})

export class SolowComponent {
  mode: number = 0;
  showPlayer: boolean = false;
  hidden: string | null = 'hidden';

  slider = new FormGroup({
    popRate: new FormControl(.01),
    depreciationRate: new FormControl(.04),
    capital: new FormControl(23539),
    savingRate: new FormControl(.25),
    productivity: new FormControl(25.99),
    labor: new FormControl(157.5),
    population: new FormControl(1500),
    capitalRatio: new FormControl(0)
  });

  chart!: Highcharts.Chart;
  chart2!: Highcharts.Chart;

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);

  }

  public updateChart(value: any) {
    this.slider.patchValue(value);
    let series = this._createSeries(false);
    if (this.mode > 1) {
      this.chart.series[0].setData(series.saving);
      this.chart.series[1].setData(series.invest);
    } else if (this.mode === 1) {
      this.chart.series[2].update(
        {
          type: 'line',
          data: series.EQ,

          label: {
            enabled: true,
            useHTML: true,
            style: {
              fontSize: '12px',
              fontWeight: '400'
            },
            formatter: () => {
              return `c(Y = ${series.invest[0].y})`;
            }

          }
        }
      );

      this.chart2.series[1].update(
        {
          type: 'line',
          data: series.EQ2,

          label: {
            enabled: true,
            useHTML: true,
            style: {
              fontSize: '12px',
              fontWeight: '400'
            },
            formatter: () => {
              return `c(k = ${series.EQ2[1].x}) = ${series.EQ2[1].y.toFixed(2)}`;
            }

          }
        }
      );
    }

  }

  public playStep(mode: number) {
    this.mode = mode;
    this.slider.setValue({
      popRate: .01,
      depreciationRate: .04,
      capital: 23539,
      savingRate: .25,
      productivity: 25.99,
      labor: 157.5,
      population: 1500,
      capitalRatio: 0
    });
    this.hidden = 'hidden';
    this._setupChart();

  }

  private _setupChart() {
    let series = this._createSeries(true);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 425,
        ignoreHiddenSeries: true,
      },
      tooltip: { enabled: true, useHTML: true },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Solow Model' },
      legend: { enabled: false },
      series: [
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Capital-labor ratio, k<sub>t</sub>' },
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Output per worker, y<sub>t</sub>' },
        min: 0,
        max: 150
      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          animation: false,
          color: '#C31229',
          tooltip: {
            headerFormat: '',
            pointFormat: '{point.name} = ${point.x:.0f} <br/>{series.name}  = ${point.y:.2f}'
          },
          label: {
            enabled: true,
          },
          marker: {
            radius: 2,
            symbol: 'circle'

          },
        }
      }
    });


    switch (this.mode) {
      case 0:
        this.chart.update({
          yAxis: {
            tickInterval: 50,
            max: 450
          }

        });

        this.chart.addSeries(
          {
            type: 'line',
            name: 'f(k)',
            zIndex: 0,
            data: series.prod
          }
        );
        break;
      case 1:
        this.hidden = null;
        this.chart.addSeries(
          {
            type: 'line',
            name: 'f(k)',
            zIndex: 0,
            data: series.prod
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: '(n + d)k',
            zIndex: 0,
            data: series.invest
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: 'f(k)',
            dashStyle: 'Dot',
            lineWidth: 1,
            color: 'black',
            zIndex: 1,
            data: series.EQ,
/*             label: {
              useHTML: true,
              style: { fontWeight: '400', textAlign: 'right' },
              format: `k<sub>max</sub> = ${series.EQ[1].x.toFixed(0)}</br>f(k) = ${series.EQ[1].y.toFixed(0)}`
            }
 */          }
        );


        this.chart.update({
          chart: {
            height: 300
          },
          yAxis: {
            tickInterval: 50,
            max: 450
          }

        });
        this.chart2 = new Highcharts.Chart('chart2', {
          chart: {
            type: 'spline',
            animation: false,
            height: 300,
            ignoreHiddenSeries: true,
          },
          tooltip: { enabled: true },
          credits: {
            text: 'Pearson Education',
            href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
          },
          title: { text: 'Consumption Per Worker' },
          legend: { enabled: false },
          series: [
            {
              type: 'line',
              name: 'Consumption per worker',
              zIndex: -1,
              animation: false,
              data: series.consumption,
              accessibility: {
                description: 'An upward-sloping straight line'
              },
              label: {
                style: {
                  fontSize: '12px',
                  fontWeight: '400'
                }
              }
            },
            {
              type: 'line',
              name: 'Equilibrium',
              enableMouseTracking: true,
              color: 'black',
              dashStyle: 'Dot',
              lineWidth: 1,
              zIndex: 2,
              allowPointSelect: true,
              animation: false,
              data: series.EQ2,
              marker: {
                enabled: true,
              },
              accessibility: {
                description: 'A point showing the intersection of the national saving and investment curves'
              },
              label: {
                useHTML: true,
                style: { fontSize: '11px', fontWeight: '400' },
                formatter: () => {
                  return `Equilibrium:</br>I = $${series.EQ[1].x}</br>r = ${series.EQ[1].y}%`;
                }
              }
            },
          ],
          xAxis: {
            lineColor: '#757575',
            lineWidth: 1.,
            tickColor: '#757575',
            title: { useHTML: true, text: 'Capital-labor ratio, k<sub>t</sub>' },
          },
          yAxis: {
            gridLineWidth: 0,
            lineColor: '#757575',
            lineWidth: 1.,
            tickColor: '#757575',
            tickWidth: 1,
            title: { useHTML: true, text: 'Consumption per worker, c' },
            min: 0
          },
          plotOptions: {
            series: {
              enableMouseTracking: true,
              color: '#C31229',
              tooltip: {
                headerFormat: '{series.name}<br/>',
                pointFormat: 'k = ${point.x:.0f} <br/>{point.name}  = ${point.y:.2f}'
              },
              label: {
                enabled: true
              },
              marker: {
                radius: 4
              },
            }
          }
        });
        break;

      default:
        this.chart.addSeries(
          {
            type: 'line',
            name: 'sf(k)',
            zIndex: 0,
            data: series.saving
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: '(n + d)k',
            zIndex: 0,
            data: series.invest
          }
        );

        break;
    }

  }

  private _createSeries(addRef: boolean) {
    // slider values
    let slider = this.slider.value;
    // model parameters
    // let max = 6 * K / N,
    let max = this.mode < 2 ? 8500 : 3000;
    let K = slider.capital!, N = slider.labor! / 10, step = max / 500;
    let x = 0, n = slider.popRate!, d = slider.depreciationRate!, s = slider.savingRate!, A = slider.productivity!, alpha = 0.3;
    let investSeries: any[] = [], prodSeries: any[] = [], savingSeries: any[] = [], eqSeries: any[] = [], eq2Series: any[] = [], consumptionSeries: any[] = [];

    let production = (x: number) => {
      return A * Math.pow(x, alpha);
    };
    let invest = (x: number) => {
      return x * (n + d);
    }

    let consumption = (x: number) => { return production(x) - invest(x); }
    let eqProd = this.mode === 1 ? slider.capitalRatio! : Math.pow(A / (d + n), 1 / (1 - alpha));
    let eqSaving = Math.pow((s * A) / (d + n), 1 / (1 - alpha));


    do {
      let point = {
        name: 'k',
        x: x,
        y: production(x)
      };
      let point2 = {
        name: 'k',
        x: x,
        y: invest(x)
      };
      let point3 = {
        x: x,
        y: s * production(x)
      };
      let point4 = {
        name: 'c',
        x: x,
        y: production(x) - invest(x)
      };

      prodSeries.push(point);
      investSeries.push(point2);
      savingSeries.push(point3);
      consumptionSeries.push(point4);

      x += step;

    } while (x <= max);

    // Other series and key points
    eqSeries = [
      [0, production(eqProd)],
      {
        name: 'k<sub>max</sub>',
        x: eqProd,
        y: production(eqProd),
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      {
        x: eqProd, y: invest(eqProd), marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      }
    ];

    eq2Series = [
      { x: 0, y: consumption(slider.capitalRatio!), marker: { enabled: false } },
      {
        name: 'k<sub>max</sub>',
        x: slider.capitalRatio!,
        y: consumption(slider.capitalRatio!),
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      [slider.capitalRatio!, -10]
    ];
    console.log(eq2Series);



    return {
      invest: investSeries,
      prod: prodSeries,
      saving: savingSeries,
      consumption: consumptionSeries,
      EQ: eqSeries,
      EQ2: eq2Series,
    }

  }

}
