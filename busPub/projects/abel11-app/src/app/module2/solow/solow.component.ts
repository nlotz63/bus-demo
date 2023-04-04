import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_annotate from 'highcharts/modules/annotations';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';

HC_annotate(Highcharts);
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

export class SolowComponent implements OnInit, AfterViewInit {
  mode: number = 0;
  showPlayer: boolean = false;
  hidden: string | null = 'hidden';
  steadyState!: number;

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
      this.hidden = this.mode === 1 ? null : 'hidden';
    });
  }

  ngAfterViewInit(): void {
    this.playStep(this.mode);

  }

  public updateChart(value: any) {
    this.slider.patchValue(value);
    let series = this._createSeries(false);
    let eqSeries = this.mode === 2 ? series.EQ4 : series.EQ3;
    let kRatio = 'k<sub>ss</sub>';

    if (this.mode == 2) {
      kRatio = this.slider.value.capitalRatio!== 1046 ? 'k' : 'k<sub>ss</sub>';
    }


    if (this.mode > 1) {
      this.chart.series[0].setData(series.saving);
      this.chart.series[1].setData(series.invest);
      this.chart.series[2].update(
        {
          type: 'line',
          data: eqSeries,

          label: {
            enabled: true,
            useHTML: true,
            style: {
              fontSize: '12px',
              fontWeight: '400'
            },
            formatter: () => {
              let k = eqSeries[1].x.toFixed(0);
              return `${kRatio} = ${k}</br>sf(${kRatio}) = ${eqSeries[1].y.toFixed(0)}`;
            }
          }
        }
      );
      if (this.mode === 2 && this.slider.value.capitalRatio! === 1046) {
        this.chart.addAnnotation({
          id: 'ss',
          labelOptions: { backgroundColor: 'rgba(255,255,255,0.65)', align: 'right', x: -165, y: -35, allowOverlap: true, borderRadius: 8, padding: 4, shadow: true, borderColor: 'rgba(54, 54, 54, 0.7)' },
          visible: true,
          labels: [
            {
              point: {
                xAxis: 0,
                yAxis: 0,
                x: eqSeries[1].x,
                y: eqSeries[1].y,
              },
              text: `You reached the steady-state<br/>capital-labor ratio. The point<br/>where the saving curve and the <br/>steady-state investment line cross.`,
              accessibility: {
                description: `You reached the steady-state capital-labor ratio. The point where the saving curve and the steady-state investment line cross.`
              }

            }

          ]

        }, true );
      } else { this.chart.removeAnnotation('ss'); }


    } else if (this.mode === 1) {
      let kRatio = '';
      switch (+this.slider.value.capitalRatio!) {
        case 7581.691:
          kRatio = 'k<sub>max</sub>';
          break;
        case 1357.6:
          kRatio = 'k<sub>gold</sub>';
          break;
        default:
          kRatio = 'k';
          break;
      }
      this.chart.series[2].update(
        {
          type: 'line',
          data: series.EQ,

          label: {
            enabled: false,
            useHTML: true,
            style: {
              fontSize: '12px',
              fontWeight: '400',
            },
            formatter: () => {
              let k = series.EQ2[1].x.toFixed(0);
              return `${kRatio} = ${k}</br>c(${kRatio}) = ${series.EQ2[1].y.toFixed(0)}`;
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
              let k = series.EQ2[1].x.toFixed(0);
              return `${kRatio} = ${k}</br>c(${kRatio}) = ${series.EQ2[1].y.toFixed(0)}`;
            }

          }
        }
      );
      let position = this._positioner(this.chart, series.EQ[1].x, series.EQ[1].y)
      let position2 = this._positioner(this.chart, series.EQ[2].x, series.EQ[2].y)

      this.chart.removeAnnotation('annote1');
      this.chart.addAnnotation({
        id: 'annote1',
        draggable: '',
        labelOptions: { backgroundColor: 'rgba(255,255,255,1)', align: 'left', x: position.xOffset, y: position.yOffset, allowOverlap: true, borderRadius: 8, borderWidth: 0, padding: 4, shadow: false, borderColor: 'white' },
        visible: true,
        labels: [
          {
            point: {
              xAxis: 0,
              yAxis: 0,
              x: series.EQ[1].x,
              y: series.EQ[1].y,
            },
            text: `Consumption per worker is the<br/>vertical height between output per<br/>worker and investment per worker.<br/>
            <i><b>c</b></i> = ${series.EQ[1].y.toFixed(0)} - ${series.EQ[2].y.toFixed(0) } = ${series.EQ2[1].y.toFixed(0)}`,
            accessibility: {
              description: `Consumption per worker is the vertical height between output per worker and investment per worker.
              c = ${series.EQ[1].y.toFixed(0)} - ${series.EQ[2].y.toFixed(0) } = ${series.EQ2[1].y.toFixed(0)}`
            }

          }

        ],
        shapes: [
          {
            type: 'path',
            strokeWidth: 1,
            fill: 'rgba(0, 0, 0, 0)',
            points: [
              {
                x: series.EQ[1].x,
                y: series.EQ[1].y,
                xAxis: 0,
                yAxis: 0
              },
              {
                x: 4300,
                y: 78,
                xAxis: 0,
                yAxis: 0
              },
              {
                x: series.EQ[2].x,
                y: series.EQ[2].y,
                xAxis: 0,
                yAxis: 0
              },

            ]
          }
        ]

      }, true);

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
    let eqSeries = this.mode === 2 ? series.EQ4 : series.EQ3;
    let kRatio = 'k<sub>ss</sub>';

    if (this.mode == 2) {
      kRatio = this.slider.value.capitalRatio!== 1046 ? 'k' : 'k<sub>ss</sub>';
    }

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
        min: 0,
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
            data: series.prod,
            label: {
              enabled: true,
            }
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: '(n + d)k',
            zIndex: 0,
            data: series.invest,
            label: {
              enabled: true,

            }
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: 'c(k)',
            dashStyle: 'Dot',
            lineWidth: 1,
            color: 'black',
            zIndex: 1,
            data: series.EQ,
         }
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
                enabled: false,
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
            min: 0,
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
        this.chart.addSeries(
          {
            type: 'line',
            name: 'point',
            lineWidth: 1,
            dashStyle: 'Dot',
            color: 'black',
            zIndex: 1,
            data: eqSeries,
            label: {
              enabled: true,
              useHTML: true,
              style: {
                fontSize: '12px',
                fontWeight: '400'
              },
              formatter: () => {
                let k = eqSeries[1].x.toFixed(0);
                return `${kRatio} = ${k}</br>sf(${kRatio}) = ${eqSeries[1].y.toFixed(0)}`;
                }

            }

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
    let investSeries: any[] = [], prodSeries: any[] = [], savingSeries: any[] = [], eqSeries: any[] = [], eq2Series: any[] = [], eq3Series: any[] = [], eq4Series: any[] = [], consumptionSeries: any[] = [];

    let production = (x: number) => {
      return A * Math.pow(x, alpha);
    };
    let invest = (x: number) => {
      return x * (n + d);
    }
    let saving = (x: number) => {
      return s*A * Math.pow(x, alpha);
    };

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
        name: 'k',
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
      },
      {x: eqProd, y: 0, marker: {enabled: false}}
    ];

    eq2Series = [
      { x: 0, y: consumption(slider.capitalRatio!), marker: { enabled: false } },
      {
        name: 'k<sub>max</sub>',
        x: +slider.capitalRatio!,
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
      { x: slider.capitalRatio!, y: 0, marker: { enabled: false } },
    ];

    eq3Series = [
      [0, saving(eqSaving)],
      {
        name: 'k<sub>max</sub>',
        x: eqSaving,
        y: saving(eqSaving),
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
        x: eqSaving, y: invest(eqSaving), marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      {x: eqSaving, y: 0, marker: {enabled: false}}
    ];

    eq4Series = [
      { x: 0, y: saving(slider.capitalRatio!), marker: { enabled: false } },
      {
        name: 'k<sub>max</sub>',
        x: +slider.capitalRatio!,
        y: saving(slider.capitalRatio!),
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      { x: slider.capitalRatio!, y: 0, marker: { enabled: false } },
    ];

    // set key properties
    this.steadyState = eq3Series[1].x;


    return {
      invest: investSeries,
      prod: prodSeries,
      saving: savingSeries,
      consumption: consumptionSeries,
      EQ: eqSeries,
      EQ2: eq2Series,
      EQ3: eq3Series,
      EQ4: eq4Series
    }

  }

  private _positioner(chart: Highcharts.Chart, pointX: number, pointY: number) {
    let xOffset = chart.chartWidth*.75 - chart.xAxis[0].toPixels(pointX, true);
    let yOffset = chart.chartHeight*.59 - chart.yAxis[0].toPixels(pointY, true);


    return {
      xOffset: xOffset,
      yOffset: yOffset,
    }


  }

}
