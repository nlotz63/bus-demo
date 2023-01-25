import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'

import { Module2RoutingModule } from './module2-routing.module';
import { KeyDiagram3Component } from './key-diagram3/key-diagram3.component';
import { PlayerModule } from '../player/player.module';
import { BusPubLibModule } from 'bus-pub-lib';



@NgModule({
  declarations: [
    KeyDiagram3Component
  ],
  imports: [
    CommonModule,
    Module2RoutingModule,
    PlayerModule,
    ReactiveFormsModule,
    BusPubLibModule
  ]
})
export class Module2Module { }
