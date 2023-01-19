import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  @Input() steps: number = 0;
  @Input() mode: number = 0;

  @Output() modeChange = new EventEmitter<number>();

  public stepper(increase: boolean) {
    if (increase) {
      this.mode = this.mode + 1;
    } else {
      this.mode = this.mode - 1;
    }
    this.modeChange.emit(this.mode);

  }

}
