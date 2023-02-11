import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fig92Component } from './fig92/fig92.component';
import { KeyDiagram6Component } from './key-diagram6/key-diagram6.component';
import { KeyDiagram7Component } from './key-diagram7/key-diagram7.component';

const routes: Routes = [
  { path: 'key-diagram6', component: KeyDiagram6Component, title: 'ISLM model' },
  { path: 'key-diagram7', component: KeyDiagram7Component, title: 'AD/AS model' },
  { path: 'figure9.2', component: Fig92Component, title: 'Derive IS curve' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module3RoutingModule { }
