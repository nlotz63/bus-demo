import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Module1RoutingModule } from './module1-routing.module';
import { Figure31Component } from './figure31/figure31.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { BusPubLibModule } from 'bus-pub-lib';


@NgModule({
    imports: [
    CommonModule,
    Module1RoutingModule,
    BusPubLibModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    Figure31Component
]
})
export class Module1Module { }
