import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module3RoutingModule } from './module3-routing.module';
import { KeyDiagram6Component } from './key-diagram6/key-diagram6.component';
import { KeyDiagram7Component } from './key-diagram7/key-diagram7.component';
import { BusPubLibModule } from 'bus-pub-lib';
import { PlayerModule } from '../player/player.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Fig92Component } from './fig92/fig92.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeyDiagram8Component } from './key-diagram8/key-diagram8.component';
import { Fig94Component } from './fig94/fig94.component';


@NgModule({
  declarations: [
    KeyDiagram6Component,
    KeyDiagram7Component,
    Fig92Component,
    KeyDiagram8Component,
    Fig94Component
  ],
  imports: [
    CommonModule,
    Module3RoutingModule,
    BusPubLibModule,
    PlayerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class Module3Module { }
