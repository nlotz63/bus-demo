import { AfterViewChecked, AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';

import * as Highcharts from 'highcharts';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);


interface Food {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-interactive01',
  standalone: true,
  imports: [CommonModule, BusPubLibModule, MatSliderModule, MatSelectModule ],
  templateUrl: './interactive01.component.html',
  styleUrls: ['./interactive01.component.scss']
})
export class Interactive01Component implements OnInit, AfterViewInit {

  mode = 0;


  config = [{
    title: 'Equilibrium'
  }
  ];

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  demandShift = 0;
  supplyShift = 0;

  chart!: Highcharts.Chart;

  constructor() { }

  ngOnInit(): void {


  }

  ngAfterViewInit(): void {
    let series = this._createSeries();
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        styledMode: false,
        shadow: { color: 'grey', offsetX: 1, offsetY: 1},
        borderRadius: 5

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
      sonification: {
        duration: 5000
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
          zIndex: 1,
          data: series.EQ,
          label: {
            enabled: false
          },
          marker: {
            fillColor: '#FAF6EE',
            lineWidth: 1,
            lineColor: 'black',
            radius: 4
          }

      },
        {
          type: 'line',
          name: 'Demand',
          lineWidth: 2,
          color: '#0771BD',
          data: series.demand
        },
        {
          type: 'line',
          name: 'Supply',
          lineWidth: 2,
          color: '#C62828',
          data: series.supply
        }

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
          }
        }
      }

    });

  }

  private _createSeries() {
    let x = 18, a = 120, b = 2, c = -13, d = 1.8;
    let demandSeries = [], supplySeries = [];

    let demand = (x: number): number => {
      return a - b * x;
    }

    let supply = (x: number): number => {
      return c + d * x ;
    }
    let qd = (y: number) => { return (a - y) / b; }
    let qs = (y: number) => { return (y - c) / d; }

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
      x = x + 5;

    } while (x <= 57);

    let eqX = (a - c) / (b + d);

    let eqSeries = [
      { x: 10, y: demand(eqX), accessibility: { enabled: false }},
      { name: 'Equilibrium:', x: eqX, y: demand(eqX), marker: { enabled: true} },
      { x: eqX, y: 5, accessibility: { enabled: false } }
    ];
    console.log(eqSeries);

    return {
      demand: demandSeries,
      supply: supplySeries,
      EQ: eqSeries
    }



  }
}
