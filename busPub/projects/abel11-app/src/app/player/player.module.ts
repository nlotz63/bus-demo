import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    PlayerComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    PlayerComponent
  ]
})
export class PlayerModule { }
