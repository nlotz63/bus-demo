import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module1RoutingModule } from './module1-routing.module';
import { Figure31Component } from './figure31/figure31.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PlayerModule } from '../player/player.module';
import { BusPubLibModule } from 'bus-pub-lib';


@NgModule({
  declarations: [
    Figure31Component
  ],
  imports: [
    CommonModule,
    Module1RoutingModule,
    PlayerModule,
    BusPubLibModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ]
})
export class Module1Module { }
