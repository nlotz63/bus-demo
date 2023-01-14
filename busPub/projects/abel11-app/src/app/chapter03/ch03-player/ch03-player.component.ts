import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { transition, trigger, style, animate } from '@angular/animations';


@Component({
  selector: 'app-ch03-player',
  templateUrl: './ch03-player.component.html',
  styleUrls: ['./ch03-player.component.scss'],
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
export class Ch03PlayerComponent implements OnInit, AfterViewInit {

  model!: string;
  stepArray: number[] = [];
  ready = true;
  step = 0;
  nextDisabled = false;
  backDisabled = true;

  constructor(private activeRoute: ActivatedRoute, private title: Title) { }

  ngOnInit(): void {
    let steps = 0;
    let newTitle = '';
    this.activeRoute.queryParams.subscribe((params) => {
      this.model = params['model'];
      steps = Number(params['steps']);
    });
    for (let i = 0; i < steps; i++) {
      this.stepArray.push(i);
    }
    switch (this.model) {
      case 'pf01':
        newTitle = 'Production function player';
        break;
      case 'ld01':
        newTitle = 'Labor demand player';
        break;

      default:
        break;
    }
    this.title.setTitle(newTitle);
  }

  ngAfterViewInit(): void {
    this.ready = true;

  }
  public stepper(increase: boolean) {
    this.ready = false;
    this.step = increase ? this.step + 1 : this.step - 1;
    if (this.step + 1 === this.stepArray.length) {
      this.nextDisabled = true
    } else { this.nextDisabled = false; }

    if (this.step === 0) {
      this.backDisabled = true;
    } else { this.backDisabled = false}
    setTimeout(() => {
      this.ready = true;
    }, 20);
  }


}
