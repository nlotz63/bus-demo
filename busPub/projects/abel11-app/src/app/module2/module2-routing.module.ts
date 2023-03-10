import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeyDiagram3Component } from './key-diagram3/key-diagram3.component';
import { KeyDiagram4Component } from './key-diagram4/key-diagram4.component';
import { KeyDiagram5Component } from './key-diagram5/key-diagram5.component';
import { SolowComponent } from './solow/solow.component';

const routes: Routes = [
  { path: 'key-diagram3', component: KeyDiagram3Component, title: 'National Saving Model' },
  { path: 'key-diagram4', component: KeyDiagram4Component, title: 'National Saving (small open economy) Model' },
  { path: 'key-diagram5', component: KeyDiagram5Component, title: 'National Saving (large open economy) Model' },
  { path: 'figure6.5', component: SolowComponent, title: 'Solow model' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module2RoutingModule { }
