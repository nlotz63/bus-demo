import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Fig92Component } from './fig92/fig92.component';
import { Fig94Component } from './fig94/fig94.component';
import { KeyDiagram6Component } from './key-diagram6/key-diagram6.component';
import { KeyDiagram7Component } from './key-diagram7/key-diagram7.component';
import { KeyDiagram8Component } from './key-diagram8/key-diagram8.component';

const routes: Routes = [
  { path: 'key-diagram6', component: KeyDiagram6Component, title: 'ISLM model' },
  { path: 'key-diagram7', component: KeyDiagram7Component, title: 'AD/AS model' },
  { path: 'key-diagram8', component: KeyDiagram8Component, title: 'AD/AS (misperceptions)' },
  { path: 'figure9.2', component: Fig92Component, title: 'Derive IS curve' },
  { path: 'figure9.4', component: Fig94Component, title: 'Derive IS curve' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module3RoutingModule { }
