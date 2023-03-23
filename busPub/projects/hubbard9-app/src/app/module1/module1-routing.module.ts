import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Figure31Component } from './figure31/figure31.component';

const routes: Routes = [
  { path: 'figure3.1', component: Figure31Component, title: 'Demand schedule' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module1RoutingModule { }
