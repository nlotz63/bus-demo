import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { transition, trigger, style, animate } from '@angular/animations';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import HC_export from 'highcharts/modules/exporting';
import HC_data from 'highcharts/modules/data';
import HC_sonify from 'highcharts/modules/sonification';
import HC_annotate from 'highcharts/modules/annotations';
import HC_labels from 'highcharts/modules/series-label';
import HC_accessibility from 'highcharts/modules/accessibility';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusPubLibModule } from 'bus-pub-lib';

HC_more(Highcharts);
HC_export(Highcharts);
HC_data(Highcharts);
HC_sonify(Highcharts);
HC_annotate(Highcharts);
HC_labels(Highcharts);
HC_accessibility(Highcharts);

@Component({
  selector: 'app-interactive04',
  standalone: true,
  imports: [CommonModule, BusPubLibModule],
  templateUrl: './interactive04.component.html',
  styleUrls: ['./interactive04.component.scss'],
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
})

export class Interactive04Component implements OnInit, AfterViewInit {

  @Input() mode?: string | number;

  title: string = 'Cost Curves';


  constructor(private announcer: LiveAnnouncer) { }

  ngOnInit(): void {
    if (this.mode) {
      this.mode = +this.mode;
    } else { this.mode = 0; }

  }

  ngAfterViewInit(): void {

  }

  public playStep() {

  }

  public updateGraph() {

  }

  private _setupStep() {

  }

  private _createSeries() {

  }

}
