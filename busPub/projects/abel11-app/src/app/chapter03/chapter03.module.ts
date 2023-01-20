import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BusPubLibModule } from 'bus-pub-lib';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Chapter03RoutingModule } from './chapter03-routing.module';
import { ProductionFunctionComponent } from './production-function/production-function.component';
import { LaborDemandComponent } from './labor-demand/labor-demand.component';
import { UnemployDataComponent } from './unemploy-data/unemploy-data.component';
import { Ch03PlayerComponent } from './ch03-player/ch03-player.component';
import { PlayerModule } from '../player/player.module';


@NgModule({
  declarations: [
    ProductionFunctionComponent,
    LaborDemandComponent,
    UnemployDataComponent,
    Ch03PlayerComponent
  ],
  imports: [
    CommonModule,
    Chapter03RoutingModule,
    BusPubLibModule,
    PlayerModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule

  ]
})
export class Chapter03Module { }
