import { AfterViewInit, Component, OnInit, Input, signal, Signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import * as Highcharts from 'highcharts';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { EconModel, ModelService } from '../model.service';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

interface Shifters {
  value: string;
  viewValue: string;
}


interface ShiftGroup {
  disabled?: boolean;
  name: string;
  shifters: Shifters[];
}

@Component({
  selector: 'app-interactive01',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatRadioModule],
  templateUrl: './interactive01.component.html',
  styleUrls: ['./interactive01.component.scss']
})

export class Interactive01Component implements OnInit, AfterViewInit {


  nMode!: number;
  @Input() set mode(mode: string) {
    this.nMode = Number(mode);
  };

  // Mode 1 props
  shifterGroups: ShiftGroup[] = [
    {
      name: 'Demand curve',
      shifters: [
        { value: '0', viewValue: 'Tastes and Preferences' },
        { value: '1', viewValue: 'Income and wealth' },
        { value: '2', viewValue: 'Price of a related good' },
        { value: '3', viewValue: 'Number and scale of buyers' },
        { value: '4', viewValue: 'Buyers\' beliefs about the future (optimism)' },
      ]
    },
    {
      name: 'Supply curve',
      shifters: [
        { value: '5', viewValue: 'Prices of inputs used in production' },
        { value: '6', viewValue: 'Technology used in production' },
        { value: '7', viewValue: 'Number and scale of sellers' },
        { value: '8', viewValue: 'Sellers\' beliefs about the future (optimism)' }
      ]
    }
  ]

  selected: any[] = [];
  demandLabel: string = '';
  supplyLabel: string = '';
  demandShiftValue!: number;
  supplyShiftValue!: number;
  radioValue: number = 1;
  demandShift = signal(0);
  supplyShift = signal(0);
  supplyDirection: number = 1;


  // Mode 0 props
  price = signal(50);
  equation1 = computed(() => {
    if (this.price() > 50) {
      return `$$ \\text{Excess supply} = q^s - q^d > 0 $$`;
    } else if (this.price() < 50) {
      return `$$ \\text{Excess demand} = q^d - q^s > 0 $$`;
    } else {
      return `$$ \\text{Equilibrium} = q^s - q^d = 0 $$`;

    }

  });
  equation2 = computed(() => {
    let series = this.modelService.demandSupply(this.modelParams());
    let p = this.price(), qd = series.QD(p), qs: any = series.QS(p);

    if (this.price() > 50) {
      return `$$ \\text{Excess supply} = ${qs.toFixed(2)} - ${qd.toFixed(2)} = ${(qs - qd).toFixed(2)} $$`;
    } else if (this.price() < 50) {
      return `$$ \\text{Excess demand} = ${qd.toFixed(2)} - ${qs.toFixed(2)} = ${(qd - qs).toFixed(2)} $$`;

    } else {
      return `$$ \\text{Equilibrium} = ${qd.toFixed(2)} - ${qs.toFixed(2)} = ${(qd - qs).toFixed(2)} $$`;
    }

  });

  chart!: Highcharts.Chart;
  modelParams: Signal<EconModel> = computed(() => {

    return {
      xMin: 18,
      xMax: 57,
      yscale: 1,
      xscale: 1,
      xStep: 5,
      demandSlope: 2,
      supplySlope: 1.8,
      supplyIntercept: -13 - this.supplyShift(),
      demandIntercept: 120 + this.demandShift(),
      price1: this.price()

    }

  });

  constructor(private announcer: LiveAnnouncer, private modelService: ModelService, private el: ElementRef) { }

  ngOnInit(): void {
    // this._createSeries();
    this.modelService.demandSupply(this.modelParams());

  }

  ngAfterViewInit(): void {
    let series = this.modelService.demandSupply(this.modelParams());
    const container = this.el.nativeElement.querySelector('#chart1');
    this.chart = new Highcharts.Chart( container, {
      chart: {
        height: 550,
        styledMode: false,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,
      },
      caption: {
        text: `The market for oil in equilibrium. The supply and demand curves intersect at the market-clearing price of $50 per barrel and quantity of 35 billion barrels per year.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Market for Oil',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      tooltip: { useHTML: true },
      sonification: {
        duration: 20000,
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
          valueDescriptionFormat: `quantity {point.x:.0f} billion barrels, price: {point.y:.2f} dollars.`
        },
        keyboardNavigation: {
          order: ['container', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'line',
          name: 'Equilibrium',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 2,
          zIndex: 2,
          data: series.EQ,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'equilibrium',
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          label: {
            enabled: false
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point at the intersection of the supply and demand curves.'
          }
        },
        {
          type: 'line',
          name: 'Demand',
          id: 'demand',
          lineWidth: 2,
          color: '#0771BD',
          zIndex: 0,
          data: series.demand,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'demand',
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          accessibility: {
            description: 'A straight line that slopes down from left to right.'
          }

        },
        {
          type: 'line',
          name: 'Supply',
          lineWidth: 2,
          color: '#C62828',
          zIndex: 0,
          data: series.supply,
          sonification: {
            tracks: [
              {
                type: 'speech',
                mapping: {
                  text: 'supply'
                }
              },
              {
                type: 'instrument'
              }
            ]
          },
          accessibility: {
            description: 'A straight line that slopes up from left to right.'
          }

        },
        {
          type: 'line',
          name: 'Q<sub>s</sub>',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          color: 'black',
          zIndex: 1,
          data: series.QSseries,
          label: {
            enabled: false,
            useHTML: true
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point on the supply curve at the current market price.'
          }
        },
        {
          type: 'line',
          name: 'Q<sub>d</sub>',
          lineWidth: 1,
          dashStyle: 'ShortDot',
          color: 'black',
          zIndex: 1,
          label: {
            enabled: false,
            useHTML: true
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          },
          accessibility: {
            description: 'A point on the demand curve at the current market price.'
          }
        },
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Quantity (billions of barrels of oil per year)' },
        min: 15,
        max: 55
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price per barrel' },
        min: 10,
        max: 90
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          tooltip: {
            headerFormat: '',
            pointFormat: `{point.name} {point.x:.0f} billion<br/>Price: \${point.y:.2f}`
          },
        }
      },
      annotations: [
        {
          visible: false,
          shapes: [
            {
              stroke: 'black',
              type: 'path',
              strokeWidth: 1,
              points: [
                {
                  x: 50,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
                {
                  x: 20,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
              ],
              markerEnd: 'arrow',

            },
            {
              stroke: 'black',
              type: 'path',
              strokeWidth: 1,
              points: [
                {
                  x: 20,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
                {
                  x: 50,
                  y: this.price(),
                  xAxis: 0,
                  yAxis: 0
                },
              ],
              markerEnd: 'arrow',

            },
          ],
          labels: [
            {
              point: {
                x: 35,
                y: this.price(),
                xAxis: 0,
                yAxis: 0
              },
              text: this.equation1()
            }
          ]
        }
      ]
    });

    if (this.nMode === 1) {
      this.chart.series[4].remove();
      this.chart.series[3].remove();
      this.chart.update(
        {
          sonification: {
            duration: 6000,
            afterSeriesWait: 1000
          }
        },
        false
      );
      this.chart.addSeries({
        type: 'line',
        name: 'Initial equilibrium',
        dashStyle: 'ShortDot',
        lineWidth: 2,
        zIndex: 1,
        color: 'rgb(69, 69, 69)',
        data: series.EQ,
        label: { enabled: false },
        marker: {
          fillColor: 'rgb(235, 235, 235)',
          lineWidth: 1,
          lineColor: 'black',
          radius: 4
        }
      }, false);
      this.chart.addSeries(
        {
          type: 'line',
          name: 'Initial demand',
          dashStyle: 'LongDash',
          lineWidth: 1,
          zIndex: -1,
          color: 'rgb(89, 89, 89)',
          data: series.demand,
          label: { enabled: false }
        }, false);
      this.chart.addSeries({
        type: 'line',
        name: 'Initial supply',
        dashStyle: 'LongDash',
        lineWidth: 1,
        zIndex: -1,
        color: 'rgb(89, 89, 89)',
        data: series.supply,
        label: { enabled: false }
      }, true);
    }
  }

  public updateUX(event: MatSelectChange) {
    let valueArray = event.value, arrLength = valueArray.length;
    let message = '';

    valueArray.forEach((el: string) => {
      let value = Number(el);
      if (value < 5) {
        this.demandShiftValue = value;
        this.shifterGroups[0].disabled = true;
        this.demandLabel = this.shifterGroups[0].shifters[value].viewValue;
        message = 'Slider added.';
      } else {
        this.supplyShiftValue = value;
        value = value - 5;
        this.shifterGroups[1].disabled = true;
        this.supplyLabel = this.shifterGroups[1].shifters[value].viewValue;
        if (value === 0) { this.supplyDirection = -1; }
        message = 'Slider added.'
      }
    });
    if (arrLength < 2) message = 'Slider and reset buttons added.';
    this.announcer.announce(message);
  }

  public reset(slidersOnly: boolean) {
    if (slidersOnly) {
      this.supplyDirection = 1;
      this.supplyShift.set(0);
      this.demandShift.set(0);
      this.updateGraph();
      this.announcer.announce('The graph and sliders have been reset.');
    } else {
      this.selected = [];
      this.demandLabel = '';
      this.supplyLabel = '';
      this.shifterGroups[0].disabled = false;
      this.shifterGroups[1].disabled = false;
      this.radioValue = 1;
      this.supplyDirection = 1;
      this.supplyShift.set(0);
      this.demandShift.set(0);
      this.updateGraph();
      this.announcer.announce('The interactive has been reset.');
    }
  }

  public updateGraph(value?: number, curve?: string) {
    let direction = curve === 'demand' ? Number(this.radioValue) : this.supplyDirection;
    if (value && curve === 'demand') {
      this.demandShift.set(direction * value);
    } else if (value && curve === 'supply') {
      this.supplyShift.set(direction * value);
    }

    // this.modelParams[curve!] = this.price();

    let series = this.modelService.demandSupply(this.modelParams());

    switch (this.nMode) {
      case 0:
        this.chart.series[3].update(
          {
            type: 'line',
            data: series.QSseries,
            zIndex: this.price() < 50 ? 2 : 1

          },
          false
        );
        this.chart.series[4].update(
          {
            type: 'line',
            data: series.QDseries,
            zIndex: this.price() < 50 ? 1 : 2

          },
          false
        );
        this.chart.update(
          {
            annotations: [
              {
                visible: this.price() !== 50 ? true : false,
                draggable: '',
                shapes: [
                  {
                    stroke: 'black',
                    type: 'path',
                    strokeWidth: 1,
                    points: [
                      {
                        x: 35,
                        y: this.price(),
                        xAxis: 0,
                        yAxis: 0
                      },
                      {
                        x: this.price() < 50 ? +series.QD - .5 : +series.QD + .5,
                        y: this.price(),
                        xAxis: 0,
                        yAxis: 0
                      },
                    ],
                    markerEnd: 'arrow',

                  },
                  {
                    stroke: 'black',
                    type: 'path',
                    strokeWidth: 1,
                    points: [
                      {
                        x: 35,
                        y: this.price(),
                        xAxis: 0,
                        yAxis: 0
                      },
                      {
                        x: this.price() < 50 ? +series.QS + .5 : +series.QS - .5,
                        y: this.price(),
                        xAxis: 0,
                        yAxis: 0
                      },
                    ],
                    markerEnd: 'arrow',
                  },
                ],
                labels: [
                  {
                    point: {
                      x: 35,
                      y: this.price(),
                      xAxis: 0,
                      yAxis: 0
                    },
                    text: this.price() > 50 ? 'Excess supply' : 'Excess demand',
                    accessibility: {
                      description: `a horizontal double-arrow line at the market price between the supply and demand curves, indicating excess supply or excess demand.`
                    }
                  }
                ],
                labelOptions: {
                  backgroundColor: 'white',
                },
              }
            ]
          },
          true
        );
        break;
      default:
        this.chart.update({
          series: [
            {
              type: 'line',
              data: series.EQ
            },
            {
              type: 'line',
              data: series.demand
            },
            {
              type: 'line',
              data: series.supply
            }
          ]
        });
        break;
    }
    this.announcer.announce('The graph has been updated.');

  }

}
