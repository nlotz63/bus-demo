import { DataService } from './../../data.service';
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { forkJoin, fromEvent } from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import HC_sonify from 'highcharts/modules/sonification';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/export-data';
import accessibility from 'highcharts/modules/accessibility';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
accessibility(Highcharts);

@Component({
    selector: 'app-unemploy-data',
    templateUrl: './unemploy-data.component.html',
    styleUrls: ['./unemploy-data.component.scss'],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        NgFor,
        MatOptionModule,
        MatButtonModule,
    ],
})
export class UnemployDataComponent implements OnInit, AfterViewInit {
  //FRED URL properties
  baseUrl =
    'https://bim.pearsoncmg.com:8084/api.stlouisfed.org/fred/series/observations?';
  apiKey = 'api_key=acf875c25bc7ec2b827dd8575e5646a8&file_type=json';
  series = 'GDP';
  units = 'lin';
  fredDate = '1960-01-01';

  recessionDisabled = false;
  recessionTitle = 'Show Recessions';
  recessionToggle = false;
  selected = 0;
  viewChange = true;

  macroData = [
    {
      value: 0,
      viewValue: 'OECD Activity Rates (default)',
      series: '',
      title: '',
      yLabel: '',
      units: '',
      yAxis: 0,
      displayUnits: '',
    },
    {
      value: 1,
      viewValue: 'Unemployment Rate',
      series: 'UNRATE',
      title: 'Unemployment Rate',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 2,
      viewValue: 'Men',
      series: 'LNS14000001',
      title: 'Men',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 3,
      viewValue: 'Women',
      series: 'LNS14000002',
      title: 'Women',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 4,
      viewValue: 'White',
      series: 'LNS14000003',
      title: 'White',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 5,
      viewValue: 'Black',
      series: 'LNS14000006',
      title: 'Black',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 6,
      viewValue: 'Hispanic/Latino',
      series: 'LNS14000009',
      title: 'Hispanic/Latino',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 7,
      viewValue: 'Asian',
      series: 'LNS14032183',
      title: 'Asian',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 8,
      viewValue: 'Less Than High School Diploma',
      series: 'LNS14027659',
      title: 'Less Than High School Diploma',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 9,
      viewValue: 'High School Graduate',
      series: 'LNS14027660',
      title: 'High School Graduate',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 10,
      viewValue: "Bachelor's Degree",
      series: 'CGBD25O',
      title: "Bachelor's Degree",
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 11,
      viewValue: "Bachelor's Degree and Higher",
      series: 'LNS14027662',
      title: "Bachelor's Degree and Higher",
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 12,
      viewValue: "Master's Degree",
      series: 'CGMD25O',
      title: "Master's Degree",
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 13,
      viewValue: 'Doctoral Degree',
      series: 'CGDD25O',
      title: 'Doctoral Degree',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 14,
      viewValue: 'Professional Degree',
      series: 'CGPD25O',
      title: 'Professional Degree',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 15,
      viewValue: '16-19 Years',
      series: 'LNS14000012',
      title: '16-19 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 16,
      viewValue: '20-24 Years',
      series: 'LNS14000036',
      title: '20-24 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 17,
      viewValue: '25-34 Years',
      series: 'LNS14000089',
      title: '25-34 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 18,
      viewValue: '35-44 Years',
      series: 'LNS14000091',
      title: '35-44 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 19,
      viewValue: '45-54 Years',
      series: 'LNS14000093',
      title: '45-54 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 20,
      viewValue: '55-64 Years',
      series: 'LNU04000095',
      title: '55-64 Years',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
    {
      value: 21,
      viewValue: '65 Years and Over',
      series: 'LNU04000097',
      title: '65 Years and Over',
      yLabel: '',
      units: 'lin',
      yAxis: 0,
      displayUnits: '%',
    },
  ];

  // Highcharts
  chart!: any;
  plotBand: any[] = [];
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline',
      height: 500,
    },
    credits: {
      text: 'Pearson Education',
      href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
    },

    title: {text: 'Labor Force Participation Rates'},
    subtitle: {text: 'Prime&ndash;Age: People 25&ndash;54 years old'},
    legend: {
      enabled: true
    },
    xAxis: [
      {
        opposite: false,
        plotBands: this.plotBand,
      },
    ],
    yAxis: [
      {
        opposite: false,
        labels: {
          formatter: function() {
            return this.value + '%';
          }
        }


      }
    ],
    plotOptions: {
      series: {
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.1f}%</b>'
        }
      }
    }

  }

  constructor(private data: DataService, private el: ElementRef) {}

  ngOnInit(): void {
    // Apply the theme
    Highcharts.setOptions({
      colors: [
        '#DC2A2A',
        '#007FAA',
        '#9B59B6',
        '#DB0A5B',
        '#1460AA',
        '#406098',
        '#D43900',
        '#007A4B',
        '#005051',
        '#2574A9',
        '#802200',
      ],
      title: {
        style: {
          color: '#000',
          font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
        },
      },
      subtitle: {
        style: {
          color: '#666666',
          font: 'bold 14px "Trebuchet MS", Verdana, sans-serif',
        },
      },
      legend: {
        itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: 'black',
        },
        itemHoverStyle: {
          color: 'gray',
        },
      },
    });
    this.renderRecession();

    // recession event handler
    const recession = document.getElementById('recession');
    const showRecession = fromEvent(recession!, 'click');
    showRecession.subscribe(() => {
      const plotBandCount = this.chart.xAxis[0].plotLinesAndBands.length;
      let options: Highcharts.Options = {};

      if (this.recessionToggle) {
        options.xAxis = { plotBands: [] };
        this.recessionTitle = 'Show recessions';
      } else {
        options.xAxis = { plotBands: this.plotBand };
        this.recessionTitle = 'Hide recessions';
      }
      this.chart.update(options, true);
      this.recessionToggle = !this.recessionToggle;
    });
  }

  ngAfterViewInit(): void {
    const chart1 = this.el.nativeElement.querySelector('#container');
    this.chart = new Highcharts.StockChart(chart1, this.chartOptions);
    this.addSeries();

  }

  public addSeries() {
    if(this.selected === 0) {
      this.resetChart();
      this.selected = 0;
      this._renderDefaultView();
    } else {
      this._renderNewData();
    }
  }

  private _renderDefaultView() {
    //this.viewChange = false;
    let
    url01 = this.baseUrl + 'series_id=' + 'LRAC25TTUSM156S' +'&observation_start=' + this.fredDate + '&' + this.apiKey,
    url02 = this.baseUrl + 'series_id=' + 'LRAC25MAUSM156S' +'&observation_start=' + this.fredDate + '&' + this.apiKey,
    url03 = this.baseUrl + 'series_id=' + 'LRAC25FEUSM156S' +'&observation_start=' + this.fredDate + '&' + this.apiKey;

    this.data.getData(url01).subscribe((data: any) => {
      let seriesData = this._parseData(data);
      this.chart.addSeries({
        type: 'spline',
        name: 'Overall',
        data: seriesData,
        color: '#0076A3'

      });
    });
    this.data.getData(url02).subscribe((data: any) => {
      let seriesData = this._parseData(data);
      this.chart.addSeries({
        type: 'spline',
        name: 'Men',
        data: seriesData,
        color: '#C31229'

      });
    });
    this.data.getData(url03).subscribe((data: any) => {
      let seriesData = this._parseData(data);
      this.chart.addSeries({
        type: 'spline',
        name: 'Women',
        data: seriesData,
        color: '#097B82'

      });

    });

  }

  private _renderNewData() {
    let recessionPlots = [];
    const macroData = this.macroData[this.selected];
    const series = 'series_id=' + macroData.series,
          units = 'units=' + macroData.units,
          date = 'observation_start=' + this.fredDate,
          url = this.baseUrl + series + '&' + units + '&' + date + '&' + this.apiKey;

    if(this.recessionToggle) {
      recessionPlots = this.plotBand;
    }

    if(this.viewChange) {
      this.chart.destroy();
      this.chart = new Highcharts.StockChart('container', {
        chart: {
          type: 'spline',
          height: 500
        },
        credits: {
          text: 'Pearson Education',
          href: 'javascript:window.open("https://www.pearson.com/", "_blank")',
        },
            title: {text: 'Unemployment Demographics'},
        subtitle: {text: 'Unemployment Rates'},
        legend: {
          enabled: true
        },
        xAxis: [
          {
            opposite: false,
            plotBands: recessionPlots,
          },
        ],
        yAxis: [
          {
            opposite: false,
            labels: {
              formatter: function() {
                return this.value + '%';
              }
            }


          }
        ],
        plotOptions: {
          series: {
            tooltip: {
              pointFormat: '{series.name}: <b>{point.y:.1f}%</b>'
            }
          }
        }

      });
      this.viewChange = false;
    }
    this.data.getData(url).subscribe((data: any) => {
      let seriesData = this._parseData(data);
      this.chart.addSeries({
        type: 'spline',
        name: macroData.title,
        data: seriesData,
      });
    });


  }

  private renderRecession() {
    const series = 'series_id=USREC';
    const units = 'units=lin';
    const date = 'observation_start=' + '1900-01-01';
    const url =
      this.baseUrl + series + '&' + units + '&' + date + '&' + this.apiKey;

    this.data.getData(url).subscribe((data: any) => {
      let plotBandArray = [];
      let prevValue = -1;
      let from: any[] = [],
        to: any[] = [];
      let seriesData = this._parseData(data);
      seriesData.forEach((el: any, index: number) => {
        const pointer = index > 1 ? index - 1 : 0;
        if (prevValue < el.y) {
          from.push(seriesData[pointer].x);
        } else if (prevValue > el.y) {
          to.push(seriesData[pointer].x);
        }
        prevValue = el.y;
      });
      let recessionCount = from.length;
      for (let i = 0; i < recessionCount; i++) {
        let plotBand = {};
        plotBand = {
          color: '#E6E6E6',
          from: new Date(from[i]).getTime(),
          to: new Date(to[i]).getTime(),
          id: plotBand,
        };
        plotBandArray.push(plotBand);
      }
      this.plotBand = plotBandArray;
    });
  }


  public resetChart() {
    this.chart.destroy();
    this.chart = new Highcharts.StockChart('container', this.chartOptions);
  this.selected = -1;
    this.recessionTitle = 'Show recessions';
    this.recessionToggle = false;
    this.recessionDisabled = false;
    this.viewChange = true;

  }

  private _parseData(data: any) {
    let seriesData: any = [];
    let units =
      this.selected > -1 ? this.macroData[this.selected].displayUnits
        : '';
    data.observations.forEach((element: any) => {
      let point = {};
      let date = new Date(element.date).getTime();
      let dateNumber = Number(date);
      let value = Number(element.value);
      point = {
        x: dateNumber,
        y: value,
        units: units,
      };
      seriesData.push(point);
    });
    return seriesData;
  }

}
