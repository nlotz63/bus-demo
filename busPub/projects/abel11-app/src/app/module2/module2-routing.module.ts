import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeyDiagram3Component } from './key-diagram3/key-diagram3.component';

const routes: Routes = [
  {path: 'key-diagram3', component: KeyDiagram3Component, title: 'National Saving Model'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Module2RoutingModule { }
