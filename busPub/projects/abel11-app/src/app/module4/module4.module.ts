import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusPubLibModule } from 'bus-pub-lib';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms'

import {MatRadioModule} from '@angular/material/radio';

import { Module4RoutingModule } from './module4-routing.module';
import { Fig134Component } from './fig134/fig134.component';
import { Fig135Component } from './fig135/fig135.component';
import { Fig139Component } from './fig139/fig139.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
    imports: [
    CommonModule,
    Module4RoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    BusPubLibModule,
    MatSelectModule,
    MatRadioModule,
    Fig134Component,
    Fig135Component,
    Fig139Component,
]
})
export class Module4Module { }
