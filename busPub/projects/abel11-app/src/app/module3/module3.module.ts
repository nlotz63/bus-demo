import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module3RoutingModule } from './module3-routing.module';
import { KeyDiagram6Component } from './key-diagram6/key-diagram6.component';
import { KeyDiagram7Component } from './key-diagram7/key-diagram7.component';
import { BusPubLibModule } from 'bus-pub-lib';
import { PlayerModule } from '../player/player.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    KeyDiagram6Component,
    KeyDiagram7Component
  ],
  imports: [
    CommonModule,
    Module3RoutingModule,
    BusPubLibModule,
    PlayerModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class Module3Module { }
