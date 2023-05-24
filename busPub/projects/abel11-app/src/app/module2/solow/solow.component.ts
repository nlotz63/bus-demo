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
import HC_sonify from 'highcharts/modules/sonification';
import { PlayerComponent } from '../../player/player/player.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgIf, DecimalPipe, PercentPipe } from '@angular/common';

HC_annotate(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
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
    ],
    standalone: true,
    imports: [NgIf, BusPubLibModule, MatFormFieldModule, MatSelectModule, MatOptionModule, PlayerComponent, DecimalPipe, PercentPipe]
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

  prevSavingRate = .25;
  prevCapitalRatio = 0;
  prevPopRate = .01;
  prevProductivity = 25.99;


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
          labelOptions: { backgroundColor: 'rgb(255, 255, 255)', align: 'right', x: -165, y: -35, allowOverlap: true, borderRadius: 8, padding: 4, shadow: true, borderColor: 'rgba(54, 54, 54, .4)' },
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
          accessibility: {
            point: {
              valueDescriptionFormat: `${kRatio}: {point.x:.1f}, {series.name}: {point.y:.2f}`
            }

          },

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
      this.messageBuilder(series.EQ)

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
    this.announcer.announce(`Step ${mode + 1} has loaded.`)
  }

  public messageBuilder(eq: any[] =[] ) {
    let slider = this.slider.value;
    let message = ``;

    switch (this.mode) {
      case 1:
        message = `Capital per worker is ${eq[1].x.toFixed(0)}. Consumption equals ${eq[1].y.toFixed(0)} minus ${eq[2].y.toFixed(0)} equals ${(eq[1].y - eq[2].y).toFixed(0)} dollars.`;
        break;
      case 2:
        if (+slider.capitalRatio! < 1046) {
          message = `Capital per worker is less than the steady state`;
        } else if (+slider.capitalRatio! === 1046) {
          message = `You reached the steady-state capital-labor ratio. The point where the saving curve and the steady-state investment line cross.`;
        } else {
          message = `Capital per worker is greater than the steady state.`;
        }
        break;
      case 3:
        if (this.prevSavingRate < slider.savingRate!) {
          message = `The saving curve shifted up, increasing the steady-state capital-labor ratio.`;
        } else {
          message = `The saving curve shifted down, decreasing the steady-state capital-labor ratio.`;
        }
        this.prevSavingRate = slider.savingRate!;
        break;
      case 4:
        if (this.prevPopRate < slider.popRate!) {
          message = `The investment line became steeper, decreasing the steady-state capital-labor ratio.`;
        } else {
          message = `The investment line became flatter, increasing the steady-state capital-labor ratio.`;
        }
        this.prevPopRate = slider.popRate!;
        break;
      case 5:
        if (this.prevProductivity < slider.productivity!) {
          message = `The saving curve shifted up, increasing the steady-state capital-labor ratio.`;
        } else {
          message = `The saving curve shifted down, decreasing the steady-state capital-labor ratio.`;
        }
        this.prevProductivity = slider.productivity!;
        break;

      default:
        break;
    }
    message = message + ``
    this.announcer.announce(message);
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
      accessibility: {
        series: {
          pointDescriptionEnabledThreshold: false,
          describeSingleSeries: true
        }
      },
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
          lineWidth: 2,
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
            symbol: 'circle',
            enabled: false

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
            type: 'spline',
            name: 'f(k)',
            zIndex: 0,
            data: series.prod,
            accessibility: {
              description: `A concave curve beginning at the origin, rises sharply at first but then more slowly, becoming flatter and flatter.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.0f}, Output per worker: {point.y:.0f}`
              }
            }
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
            },
            accessibility: {
              description: `A concave curve beginning at the origin, rises sharply at first but then more slowly, becoming flatter and flatter.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.0f}, Output per worker: {point.y:.0f}`

              }
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
            },
            accessibility: {
              description: `An upward-sloping straight line.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, Investment per worker: {point.y:.2f}`
              }
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
            accessibility: {
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, investment per worker: {point.y:.2f}`
              }
            }
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
          accessibility: {
            point: {
              valueDescriptionFormat: `capital per worker: {point.x:.0f}, consumption per worker: {point.y:.0f}`
            }
            },

          series: [
            {
              type: 'line',
              name: 'Consumption per worker',
              zIndex: 0,
              animation: false,
              lineWidth: 2,
              data: series.consumption,
              accessibility: {
                description: 'A concave curve beginning at the origin, it rises sharply, reaches a peak,  and then gradually declines to the horizontal axis.',
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
                headerFormat: '',
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
            data: series.saving,
            accessibility: {
              description: `A concave curve beginning at the origin, rises sharply at first but then more slowly, becoming flatter and flatter.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.0f}, Saving per worker: {point.y:.0f}`

              }
            }

          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: '(n + d)k',
            zIndex: 0,
            data: series.invest,
            accessibility: {
              description: `An upward-sloping straight line.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, Investment per worker: {point.y:.2f}`
              }
            }
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: 'sf(k)',
            lineWidth: 1,
            dashStyle: 'Dot',
            color: 'black',
            zIndex: 2,
            data: eqSeries,
            accessibility: {
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, saving per worker: {point.y:.2f}`
              }
            },
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
        this.chart.addSeries(
          {
            type: 'line',
            name: 'Initial sf(k)',
            zIndex: -1,
            dashStyle: 'LongDash',
            lineWidth: 1,
            color: 'rgb(128, 128, 128)',
            data: series.saving,
            accessibility: {
              description: `A concave curve beginning at the origin, rises sharply at first but then more slowly, becoming flatter and flatter.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.0f}, Saving per worker: {point.y:.0f}`
              }
            },
            label: {
              enabled: false
            }
          }
        );

        this.chart.addSeries(
          {
            type: 'line',
            name: 'Initial (n + d)k',
            zIndex: -1,
            dashStyle: 'LongDash',
            lineWidth: 1,
            color: 'rgb(128, 128, 128)',
            data: series.invest,
            accessibility: {
              description: `An upward-sloping straight line.`,
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, Investment per worker: {point.y:.2f}`
              },
            },
            label: {
              enabled: false
            }
          }
        );
        this.chart.addSeries(
          {
            type: 'line',
            name: 'Initial sf(k) point',
            lineWidth: 1,
            dashStyle: 'Dot',
            color: 'rgb(128, 128, 128)',
            zIndex: 1,
            data: series.EQref,
            accessibility: {
              point: {
                valueDescriptionFormat: `Capital per worker: {point.x:.1f}, saving per worker: {point.y:.2f}`
              }
            },
            label: {
              enabled: false,
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
    let K = slider.capital!, N = slider.labor! / 10, step = max / 100;
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
    let eqProd = this.mode === 1 ? +slider.capitalRatio! : Math.pow(A / (d + n), 1 / (1 - alpha));
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

      x = x < 1000 ? x + step/2  : x + 2*step;

    } while (x <= max);

    // Other series and key points
    eqSeries = [
      { x: 0, y: production(eqProd), accessibility: { enabled: false }, marker: {radius: 0} },
      {
        name: 'k',
        x: eqProd,
        y: production(eqProd),
        marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        },
        accessibility: {
          description: `Key point on the production function.`,
        }
      },
      {
        name: 'k',
        x: eqProd, y: invest(eqProd), marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        },
        accessibility: {
          description: `Key point on the investment per worker line.`,
        }
      },
      {x: eqProd, y: 0, marker: {enabled: false, radius: 0}, accessibility: {enabled: false}}
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
      { x: slider.capitalRatio!, y: 0, marker: { enabled: false, radius: 0 }, accessility: {enabled: false} },
    ];

    eq3Series = [
      { x: 0, y: saving(eqSaving), accessibility: { enabled: false }, marker: {enabled: false, radius: 0} },
      {
        name: 'k',
        x: eqSaving, y: invest(eqSaving), marker: {
          enabled: true,
          fillColor: 'orange',
          lineColor: 'black',
          lineWidth: 1,
          radius: 4,
          symbol: 'circle'
        }
      },
      {
        x: eqSaving, y: 0, marker: { enabled: false, radius: 0 },
      accessibility: {enabled: false}}
    ];

    eq4Series = [
      { x: 0, y: saving(slider.capitalRatio!), marker: { enabled: false, radius: 0 }, accessibility: {enabled: false} },
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
      { x: slider.capitalRatio!, y: 0, marker: { enabled: false, radius: 0 }, accessibility: {enabled: false} },
    ];

    let eqRef = this.mode > 2 ? [
      { x: 0, y: saving(eqSaving), accessibility: { enabled: false }, marker: {enabled: false, radius: 0} },
      {
        name: 'k',
        x: eqSaving, y: invest(eqSaving),
        marker: {
          enabled: true,
          fillColor: 'rgb(225, 225, 225)',
          lineColor: 'black',
          lineWidth: 1,
          radius: 3,
          symbol: 'circle'
        }
      },
      {
        x: eqSaving,
        y: 0,
        accessibility: { enabled: false },
        marker: {enabled: false, radius: 0}
      }
    ] : [];


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
      EQ4: eq4Series,
      EQref: eqRef
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
