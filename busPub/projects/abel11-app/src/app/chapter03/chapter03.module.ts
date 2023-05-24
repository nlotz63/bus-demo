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



@NgModule({
    imports: [
    CommonModule,
    Chapter03RoutingModule,
    BusPubLibModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ProductionFunctionComponent,
    LaborDemandComponent,
    UnemployDataComponent,
]
})
export class Chapter03Module { }
