import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'

import { Module2RoutingModule } from './module2-routing.module';
import { KeyDiagram3Component } from './key-diagram3/key-diagram3.component';
import { PlayerModule } from '../player/player.module';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatButtonModule } from '@angular/material/button';
import { KeyDiagram4Component } from './key-diagram4/key-diagram4.component';
import { KeyDiagram5Component } from './key-diagram5/key-diagram5.component';



@NgModule({
  declarations: [
    KeyDiagram3Component,
    KeyDiagram4Component,
    KeyDiagram5Component
  ],
  imports: [
    CommonModule,
    Module2RoutingModule,
    PlayerModule,
    ReactiveFormsModule,
    MatButtonModule,
    BusPubLibModule
  ]
})
export class Module2Module { }
