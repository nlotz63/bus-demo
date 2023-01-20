import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() steps: number = 0;
  @Input() mode: number = 0;
  nextDisabled = false;
  backDisabled = true;

  @Output() modeChange = new EventEmitter<number>();

  ngOnInit(): void {

    this.nextDisabled = this.mode + 1 === this.steps ? this.nextDisabled = true : this.nextDisabled = false;
    this.backDisabled = this.mode === 0 ? this.backDisabled = true : this.backDisabled = false;

  }

  public stepper(increase: boolean) {
    this.mode = increase ? this.mode + 1 : this.mode - 1;
    this.modeChange.emit(this.mode);
    if (this.mode + 1 === this.steps) {
      this.nextDisabled = true
    } else { this.nextDisabled = false; }

    if (this.mode === 0) {
      this.backDisabled = true;
    } else { this.backDisabled = false}
  }


}
