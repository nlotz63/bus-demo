import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module4RoutingModule } from './module4-routing.module';
import { Fig134Component } from './fig134/fig134.component';
import { Fig135Component } from './fig135/fig135.component';
import { Fig139Component } from './fig139/fig139.component';


@NgModule({
  declarations: [
    Fig134Component,
    Fig135Component,
    Fig139Component
  ],
  imports: [
    CommonModule,
    Module4RoutingModule
  ]
})
export class Module4Module { }
