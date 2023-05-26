import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormField } from '@angular/material/form-field';
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

  chart!: Highcharts.Chart;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.chart = new Highcharts.Chart('chart1', {
      chart: {
        height: 550,
        styledMode: false

      },
      caption: {
        text: `The market for oil in equilibrium. The supply and demand curves intersect at the market price of 50 dollars per barrel and quantity of 35 billion barrels per year.`
      },
      credits: {
        text: 'Pearson Education',
        href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
      },
      title: {
        text: 'The market for oil',
        style: {
          fontFamily: 'sans-serif',
          fontWeight: '300',
          fontSize: '1.2em'

        }
      },
      legend: { enabled: false },
      sonification: {
        duration: 2000
      },
      accessibility: {
        point: {
          valueDescriptionFormat: `quantity {point.x:.0f} billion dollars, real interest rate: {point.y:.2f} percent.`
        }
      },
      series: [
        {
          type: 'line',
          data: [7, 5, 3, 1]
        }
      ],
      xAxis: {
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        title: { useHTML: true, text: 'Desired national saving S<sup>d</sup>, and desired investment, I<sup>d</sup> (billions of dollars)' },
        min: 0
      },
      yAxis: {
        gridLineWidth: 0,
        lineColor: '#757575',
        lineWidth: 1.,
        tickColor: '#757575',
        tickWidth: 1,
        title: { useHTML: true, text: 'Real interest rate, r' },
      },


    });

  }
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}
