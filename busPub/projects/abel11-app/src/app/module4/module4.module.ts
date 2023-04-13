import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms'
import { PlayerModule } from '../player/player.module';
import {MatRadioModule} from '@angular/material/radio';

import { Module4RoutingModule } from './module4-routing.module';
import { Fig134Component } from './fig134/fig134.component';
import { Fig135Component } from './fig135/fig135.component';
import { Fig139Component } from './fig139/fig139.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    Fig134Component,
    Fig135Component,
    Fig139Component
  ],
  imports: [
    CommonModule,
    Module4RoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    BusPubLibModule,
    PlayerModule,
    MatSelectModule,
    MatRadioModule,

  ]
})
export class Module4Module { }
