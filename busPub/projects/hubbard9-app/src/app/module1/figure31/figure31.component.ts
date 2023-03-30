import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { transition, trigger, style, animate } from '@angular/animations';


import * as Highcharts from 'highcharts';
import HC_accessibility from 'highcharts/modules/accessibility';
import HC_seriesLabel from 'highcharts/modules/series-label';
import HC_annotate from 'highcharts/modules/annotations';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import { MatSnackBar } from '@angular/material/snack-bar';

HC_annotate(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_seriesLabel(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-figure31',
  templateUrl: './figure31.component.html',
  styleUrls: ['./figure31.component.scss'],
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


export class Figure31Component implements OnInit, AfterViewInit {
  showPlayer: boolean = true;
  mode: number = 0;
  chart!: Highcharts.Chart;

  slider = new FormGroup({
    price: new FormControl(150)
  });

  previousPrice = 175;
  previousQd = 7;

  constructor(private ActiveRoute: ActivatedRoute, private announcer: LiveAnnouncer, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.ActiveRoute.queryParams.subscribe((params) => {
      this.mode = params['mode'] ? Number(params['mode']) : this.mode;
      this.showPlayer = params['showPlayer'] === 'true' ? true : false;
    });

  }
  ngAfterViewInit() {
    this.playStep(this.mode);

  }

  public playStep(mode: number) {
    this.mode = mode;
    this.slider.setValue(
      {
        price: 175
      }
    );

    this._setupChart(mode);

  }

  public updateChart(value: any) {
    this.slider.setValue(value);
    let series = this._createSeries(false), price = this.slider.value.price!;
    let qd = series.invDemand(price);
    let direction = this.previousPrice > price ? 'decrease' : 'increase', direction2 = this.previousPrice < price ? 'decrease' : 'increase';
    let xPos = price < 100 ? -45 : 35, yPos = price < 100 ? 35 : -30, align: Highcharts.AlignValue = price < 100 ? 'right' : 'left';

    this.chart.update({
      annotations: [
        {
          animation: false,
          labelOptions: { backgroundColor: 'rgba(255,255,255,0.65)', align: align, x: xPos, y: yPos, allowOverlap: false, borderRadius: 8, padding: 4, shadow: true, borderColor: 'rgba(54, 54, 54, 0.8)' },
          labels: [
         { point: {x: qd, y: price, xAxis: 0, yAxis: 0},
              text: `When the price ${direction}s from $${this.previousPrice}</br>to $${price}, the quantity demanded</br> ${direction2}s from ${this.previousQd}M to ${qd}M pairs of</br>shoes per week.`,
              accessibility: {
                description: `When the price ${direction}s from $${this.previousPrice} to $${price}, the quantity demanded ${direction2}s from ${this.previousQd} million to ${qd} million pairs of shoes per week.`
              }
            }
          ]}
      ],
      yAxis: {
        labels: {
          formatter: (el) => {
            if (el.value === this.slider.value.price) {
              return '<span style="fill: rgb(233, 30, 99);font-weight: 800;font-size: 12px;">' + '$' + el.value + '</span>';
            }
            return '$' + el.value;
          }

        }

      },
      xAxis: {
        labels: {
          formatter: (el) => {
            if (el.value === series.point[1].x) {
             return '<span style="fill: rgb(233, 30, 99);font-weight: 800;font-size: 12px;">' + el.value + '</span>';
            }
            return el.value.toString();
          }
        }
      }
    });
    this.chart.series[1].update({
      type: 'line',
      data: series.point,
      accessibility: {
        description: `A highlighted point on the demand curve. It's position is controlled by the price slider. It corresponds to the row in the table at the same price. The price equals ${price} and the quantity demanded equals ${qd}.`
      }
    });
    let message = `The current price and quantity is highlighted in both the table and graph. The price ${direction}d from $${this.previousPrice} to $${price}, the quantity demanded ${direction2}d from ${this.previousQd} million to ${qd} million pairs of shoes per week.`;
    this.announcer.announce(message);

    this.previousPrice = price;
    this.previousQd = qd;


  }

  //private methods
  private _setupChart(mode: number) {
    let series = this._createSeries(true);
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        type: 'spline',
        animation: false,
        height: 540,
        ignoreHiddenSeries: true,
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: { text: 'Demand Curve' },
      legend: { enabled: false },
      series: [
        {
          type: 'line',
          name: 'Demand',
          zIndex: 0,
          lineWidth: 3,
          color: 'rgba(7, 113, 189, 1)',
          animation: false,
          data: series.demand,
          label: {
            style: { fontSize: '12px', fontWeight: '400' }
          },
          marker: {
            fillColor: 'black',
            radius: 4,
            enabled: true
          },
          accessibility: {
            description: 'A downward sloping straight line with 7 points'
          },
        },
        {
          type: 'line',
          name: 'Quantity demanded',
          zIndex: 1,
          color: 'black',
          dashStyle: 'Dot',
          lineWidth: 1,
          data: series.point,
          label: {
            enabled: false
          },
          marker: {
            symbol: 'circle',
            fillColor: 'rgb(233, 30, 99)',
            radius: 6,
            enabled: true
          },
          accessibility: {
            description: `A highlighted point on the demand curve, indicating the current price and quantity demanded. It corresponds to the highlighted row in the table. Quantity equal 7, price equals 175 dollars.`
          },
        }
      ],
      annotations: [
        {
          labelOptions: { backgroundColor: 'rgba(255,255,255,0.65)', align: 'left', x: 25, y: -25, allowOverlap: true, borderRadius: 8, padding: 4, shadow: true, borderColor: 'rgba(54, 54, 54, 0.7)' },
          labels: [
         { point: {x: 7, y: 175, xAxis: 0, yAxis: 0},
              text: 'Use the slider to see the relationship between</br>the demand schedule and demand curve.',
              accessibility: {
                description: 'Use the slider to see the relationship between the demand schedule and demand curve.'
              }
            }
        ]}
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Quantity (millions of pairs of shoes per week)' },
        min: 6,
        max: 15,
        tickInterval: 1,
        labels: {
          formatter: (el) => {
            if (el.value === series.point[1].x) {
             return '<span style="fill: rgb(233, 30, 99);font-weight: 800;font-size: 12px;">' + el.value + '</span>';
            }
            return el.value.toString();
          }
        }
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Price (dollars per pair of shoes)' },
        min: 0,
        max: 200,
        tickInterval: 25,
        labels: {
          formatter: (el) => {
            if (el.value === this.slider.value.price) {
             return '<span style="fill: rgb(233, 30, 99);font-weight: 800;font-size: 12px;">' + '$' + el.value + '</span>';
            }
            return '$' + el.value;
          }

        }

      },
      plotOptions: {
        series: {
          enableMouseTracking: true,
          color: '#C31229',
          tooltip: {

          }
        }
      },
      tooltip: {enabled: false}
    });


  }

  private _createSeries(addRef: boolean) {
    let slider = this.slider.value, demandSeries: any[] = [];
    let x = 7, price = slider.price!;
    let demandShift = 350, b = 25;

    let demand = (x: number) => {
      return demandShift - b * x;
    }
    let inverseDemand = (x: number) => {
      return (demandShift - x) / b;
    }

    do {
      let point = {
        x: x,
        y: demand(x)
      }
      demandSeries.push(point);
      x += 1;


    } while (x <= 13);

    let pointSeries: any[] = [
      { x: 6, y: price, marker: {enabled: false, radius: 0} },
      { x: inverseDemand(price), y: price },
      { x: inverseDemand(price), y: 0, marker: {enabled: false, radius: 0} }
    ];

    return {
      demand: demandSeries,
      point: pointSeries,
      invDemand: inverseDemand
    }

}

}
