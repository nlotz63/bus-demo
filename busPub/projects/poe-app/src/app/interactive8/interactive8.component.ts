import { AfterViewInit, Component, OnInit, Input, signal, computed, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';

import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

interface SliderGroup {
  worldPrice: FormControl<number | null>,
  tariff: FormControl<number | null>
}

@Component({
  selector: 'app-interactive8',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, ReactiveFormsModule],
  templateUrl: './interactive8.component.html',
  styleUrls: ['./interactive8.component.scss']
})
export class Interactive8Component implements OnInit, AfterViewInit {

  chart1!: Highcharts.Chart;
  CSreport!: HTMLBaseElement;

  sliderGroup = new FormGroup<SliderGroup>({
    worldPrice: new FormControl(65),
    tariff: new FormControl(25)
  })

  constructor(private el: ElementRef, private announcer: LiveAnnouncer) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this._setupGraph();
    this.CSreport = this.el.nativeElement.querySelector('#graph-update');

  }

  public updateGraph() {
    const series = this._createSeries();
    this.chart1.update({
      series: [
        {
          type: 'line',
          data: series.worldPrice,
        },
        {
          type: 'line',
          data: series.priceTariff,
        },
        {
          type: 'line',
          data: series.QSseries,
        },
        {
          type: 'line',
          data: series.QDseries,
        },
        {
          type: 'arearange',
          name: 'CS',
          data: series.CS
        },
        {
          type: 'arearange',
          name: 'PS',
          data: series.PS
        },
        {
          type: 'arearange',
          data: series.REV
        },
        {
          type: 'arearange',
          zIndex: -1,
          data: series.DWL1
        },
        {
          type: 'arearange',
          zIndex: -1,
          data: series.DWL2
        },
      ],
      annotations: [
        {
          visible: true,
          labelOptions: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            align: 'left',
            y: 10,
            x: 0
          },
          labels: [
            {
              point: {
                x: series.worldPrice[1].x,
                y: series.worldPrice[1].y,
                xAxis: 0,
                yAxis: 0
              },
              text: 'World price'
            },
            {
              point: {
                x: series.priceTariff[1].x,
                y: series.priceTariff[1].y,
                xAxis: 0,
                yAxis: 0
              },
              text: 'World price + tariff'
            },
            {
              point: {
                x: (series.QS + series.QD) / 2,
                y: (series.worldPrice[0].y + series.priceTariff[0].y) / 2,
                xAxis: 0,
                yAxis: 0,


              },
              text: this.sliderGroup.value.tariff! > 5 ? 'Revenue' : ' ',
              style: { fontSize: '.8em', fontWeight: 'bold' },
              align: 'center',
              verticalAlign: 'bottom'
            }

          ]
        },
        {
          labelOptions: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            style: {
              fontSize: '.5em',
              fontWeight: 'bold'
            }
          },
          labels: [
            {
              point: {
                x: (series.QS + series.QS1 +1) / 2,
                y: series.worldPrice[0].y+1,
                xAxis: 0,
                yAxis: 0
              },
              text: this.sliderGroup.value.tariff! > 5 ? 'DWL<sub>1</sub>' : ' ',
              useHTML: true,
              align: 'center',
              verticalAlign: 'top',
              distance: 0
            },
            {
              point: {
                x: (series.QD + series.QD1 - 1) / 2,
                y: series.worldPrice[0].y + 1,
                xAxis: 0,
                yAxis: 0
              },
              text: this.sliderGroup.value.tariff! > 5 ? 'DWL<sub>2</sub>' : ' ',
              useHTML: true,
              align: 'center',
              verticalAlign: 'top',
              distance: 0
            }

          ]
        }
      ]

    });
    this.announcer.announce('The graph has been updated');
  }

  // private methods

  private _setupGraph() {
    let series = this._createSeries();
    const container = this.el.nativeElement.querySelector('#chart1');
    const slider = this.sliderGroup.value;
    this.chart1 = new Highcharts.Chart(container, {
      chart: {
        height: 550,
        styledMode: false,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1 },
        borderRadius: 5,
        animation: false,

      },
      caption: {
        text: `Click items in the legend to highlight key areas in the graph and to see additional information.`
      },
      credits: {
        text: `Pearson Education`,
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'Market for running shoes',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: {
        enabled: true,
        useHTML: true
      },
      tooltip: { useHTML: true, enabled: false },
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
          valueDescriptionFormat: `quantity {point.x:.0f} thousands of pairs, price: {point.y:.2f} dollars.`
        },
        keyboardNavigation: {
          order: ['container', 'legend', 'series', 'chartMenu']
        }
      },
      series: [
        {
          type: 'line',
          name: 'World price',
          lineWidth: 1,
          dashStyle: 'Solid',
          color: 'black',
          zIndex: 2,
          data: series.worldPrice,
          showInLegend: false,
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
            description: 'A horizontal line at the world price of running shoes.'
          }
        },
        {
          type: 'line',
          name: 'World price + tariff',
          lineWidth: 1,
          color: 'black',
          zIndex: 1,
          data: series.priceTariff,
          showInLegend: false,
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
            description: 'A horizontal line at the world price plus the amount of the tariff.'
          }
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          color: 'black',
          zIndex: 2,
          data: series.QSseries,
          showInLegend: false,
          marker: {
            radius: 0,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          },
          label: { enabled: false }
        },
        {
          type: 'line',
          dashStyle: 'ShortDash',
          color: 'black',
          zIndex: 2,
          data: series.QDseries,
          showInLegend: false,
          marker: {
            radius: 0,
            lineColor: 'black',
            lineWidth: 1,
            fillColor: 'rgb(235, 235, 235)'
          },
          label: { enabled: false }
        },
        {
          type: 'arearange',
          name: 'CS',
          color: '#FFD6AB',
          zIndex: -1,
          lineWidth: 2,
          legendIndex: 0,
          data: series.CS,
          enableMouseTracking: true
        },
        {
          type: 'arearange',
          name: 'PS',
          color: '#C2F3EF',
          legendIndex: 1,
          zIndex: -1,
          data: series.PS,
          enableMouseTracking: true
        },
        {
          type: 'arearange',
          name: 'Revenue',
          color: '#C3E0B8',
          legendIndex: 3,
          zIndex: -1,
          data: series.REV,
          enableMouseTracking: true,
          label: { enabled: false }
        },
        {
          type: 'arearange',
          name: 'DWL<sub>1</sub>',
          color: '#FFE3E0',
          legendIndex: 2,
          zIndex: -1,
          data: series.DWL1,
          enableMouseTracking: true,
          label: { useHTML: true }
        },
        {
          type: 'arearange',
          name: 'DWL<sub>2</sub>',
          color: '#FFE3E0',
          zIndex: -1,
          legendIndex: 4,
          data: series.DWL2,
          enableMouseTracking: true,
          label: { useHTML: true }
        },
        {
          type: 'line',
          name: 'Equilibrium',
          dashStyle: 'ShortDot',
          color: 'black',
          lineWidth: 0,
          zIndex: 2,
          data: series.EQ,
          showInLegend: false,
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
          showInLegend: false,
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
          showInLegend: false,
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


      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Quantity (thousands of pairs per month)' },
        min: 15,
        max: 65,
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price per pair' },
        min: 25,
        max: 250,
        tickInterval: 25
      },
      plotOptions: {
        series: {
          marker: { enabled: false, symbol: 'circle', radius: 2 },
          enableMouseTracking: false,
          animation: false,
          events: {
            legendItemClick: (event: any) => {
              const name = event.target.name, index = event.target.index;
              this._showAdditionalInformation(name, index);
              return false;
            },

          },
        }
      },
      annotations: [
        {
          visible: true,
          labelOptions: {
            borderWidth: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            align: 'left',
            y: 10,
            x: 0
          },
          draggable: '',
          labels: [
            {
              point: {
                x: series.worldPrice[1].x,
                y: series.worldPrice[1].y,
                xAxis: 0,
                yAxis: 0
              },
              text: 'World price'
            },
            {
              point: {
                x: series.priceTariff[1].x,
                y: series.priceTariff[1].y,
                xAxis: 0,
                yAxis: 0
              },
              text: 'World price + tariff'
            },
            {
              point: {
                x: (series.QS + series.QD) / 2,
                y: (series.worldPrice[0].y + series.priceTariff[0].y) / 2,
                xAxis: 0,
                yAxis: 0,
              },
              text: this.sliderGroup.value.tariff! >= 5 ? 'Revenue' : ' ',
              style: { fontSize: '.8em', fontWeight: 'bold' },
              align: 'center',
              verticalAlign: 'bottom'
            }

          ]
        },
        {
          labelOptions: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderWidth: 0,
            style: {
              fontSize: '.5em',
              fontWeight: 'bold',
            }
          },
          labels: [
            {
              point: {
                x: (series.QS + series.QS1 +1) / 2,
                y: series.worldPrice[0].y+1,
                xAxis: 0,
                yAxis: 0
              },
              text: 'DWL<sub>1</sub>',
              useHTML: true,
              align: 'center',
              verticalAlign: 'top',
              distance: 0,
            },
            {
              point: {
                x: (series.QD + series.QD1 - 1) / 2,
                y: series.worldPrice[0].y + 1,
                xAxis: 0,
                yAxis: 0
              },
              text: 'DWL<sub>2</sub>',
              useHTML: true,
              align: 'center',
              verticalAlign: 'top',
              distance: 0
            }

          ]
        }
      ]
    });
  }

  private _createSeries() {
    const slider = this.sliderGroup.value;
    const pricePlusTariff = slider.worldPrice! + slider.tariff!;
    let x = 10, a = 120, b = 2, c = -13, d = 1.8, scaler = 2.5;
    let demandSeries = [], supplySeries = [];

    let demand = (x: number): number => {
      return scaler * (a - b * x);
    }

    let supply = (x: number): number => {
      return scaler * (c + d * x);
    }
    let qd = (y: number) => { return (a - y / scaler) / b; }
    let qs = (y: number) => { return (y / scaler - c) / d; }

    do {
      let point = {
        name: 'Quantity demanded:',
        x: x,
        y: demand(x)
      }
      let point2 = {
        name: 'Quantity supplied:',
        x: x,
        y: supply(x)
      }
      demandSeries.push(point);
      supplySeries.push(point2);
      x = x + 50;

    } while (x <= 60);

    let eqX = (a - c) / (b + d);

    let eqSeries = [
      { x: 0, y: demand(eqX), accessibility: { enabled: false } },
      { name: 'Equilibrium:', x: eqX, y: demand(eqX), marker: { enabled: true } },
      { x: eqX, y: 9, accessibility: { enabled: false } }
    ];

    let qsSeries = [
      { name: 'q<sup>s</sup>:', x: qs(pricePlusTariff), y: pricePlusTariff, marker: { enabled: true } },
      { x: qs(pricePlusTariff), y: 10, accessibility: { enabled: false } }
    ],
      qdSeries = [
        { name: 'q<sup>d</sup>:', x: qd(pricePlusTariff), y: pricePlusTariff, marker: { enabled: true } },
        { x: qd(pricePlusTariff), y: 10, accessibility: { enabled: false } }
      ];
    let worldSeries = [
      { x: 0, y: slider.worldPrice! },
      { x: 50, y: slider.worldPrice! }
    ];
    let plusTariffSeries = [
      { x: 0, y: pricePlusTariff },
      { x: 50, y: pricePlusTariff }
    ];

    // Area shading
    let cs = [
      { x: 15, low: pricePlusTariff, high: demand(15) },
      { x: qdSeries[0].x, low: qdSeries[0].y, high: qdSeries[0].y }
    ];
    let ps = [
      { x: 15, low: supply(15), high: pricePlusTariff },
      { x: qsSeries[0].x, low: qsSeries[0].y, high: qsSeries[0].y }
    ];
    let revenue = [
      { x: qsSeries[0].x, low: slider.worldPrice!, high: qsSeries[0].y },
      { x: (qsSeries[0].x + qdSeries[0].x) / 2, low: slider.worldPrice!, high: qsSeries[0].y },
      { x: qdSeries[0].x, low: slider.worldPrice!, high: qdSeries[0].y }

    ];
    let dwl1 = [
      { x: qs(slider.worldPrice!), low: slider.worldPrice!, high: slider.worldPrice! },
      { x: qsSeries[0].x, low: slider.worldPrice!, high: qsSeries[0].y },
    ];
    let dwl2 = [
      { x: qd(slider.worldPrice!), low: slider.worldPrice!, high: slider.worldPrice! },
      { x: qdSeries[0].x, low: slider.worldPrice!, high: qsSeries[0].y },
    ];

    return {
      demand: demandSeries,
      supply: supplySeries,
      EQ: eqSeries,
      QD: qd(slider.worldPrice!),
      QD1: qd(pricePlusTariff),
      QS: qs(slider.worldPrice!),
      QS1: qs(pricePlusTariff),
      QSseries: qsSeries,
      QDseries: qdSeries,
      worldPrice: worldSeries,
      priceTariff: plusTariffSeries,
      CS: cs,
      PS: ps,
      REV: revenue,
      DWL1: dwl1,
      DWL2: dwl2

    }

  }

  private _showAdditionalInformation(name: string, index: number) {
    let text: string = ``;

    switch (index) {
      case 4:
        text = `Consumer surplus (CS) is the area under the demand curve and above the world price plus tariff up to the quantity demanded. While a tariff helps domestic producers by increasing producer surplus (PS), it comes at the expense of consumers. It reduces consumer surplus and creates a deadweight loss.`;
        break;
      case 5:
        text = `Producer surplus (PS) is the area above the supply curve and below the world price plus tariff up to the quantity supplied. While adversely affected by lower world prices, consumers benefit. Producers will often lobby for tariffs. Increasing the tariff increases producer surplus.`;
        break;
      case 7:
        text = `Deadweight loss one (DWL<sub>1</sub>) is the area under the supply curve and above the world price between the quantity supplied at the world price and the quantity supplied the world price plus tariff. This is the loss in social surplus resulting from production inefficiency: domestic firms are producing more than the efficient quantity relative to the world price.`;
        break;
      case 6:
        text = `The tariff generates tax revenue, which is the quantity of imported goods times the tariff. This is the area between the world price plus tariff and the world price from the quantity supplied at the world price plus tariff and the quantity demanded at the world price plus tariff.`;
        break;
      case 8:
        text = `Deadweight loss two (DWL<sub>2</sub>) is the area under the demand curve and above the world price between the quantity demanded at the world price plus tariff and the quantity demanded at the world price.  This is the loss in social surplus resulting from consumption inefficiency: consumers are consuming less than the efficient quantity relative to the world price.`;
        break;
      default:
        break;
    }

    this.CSreport.innerHTML = text;


  }

}
