import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fig134Component } from './fig134/fig134.component';
import { Fig135Component } from './fig135/fig135.component';
import { Fig139Component } from './fig139/fig139.component';

const routes: Routes = [
  { path: 'figure13.4', component: Fig134Component, title: 'Supply/demand for currency' },
  { path: 'figure13.5', component: Fig135Component, title: 'Goods market (open economy)' },
  { path: 'figure13.9', component: Fig139Component, title: 'Open economy ISLM' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module4RoutingModule { }
