import { UnemployDataComponent } from './unemploy-data/unemploy-data.component';
import { LaborDemandComponent } from './labor-demand/labor-demand.component';
import { ProductionFunctionComponent } from './production-function/production-function.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'pf01', component: ProductionFunctionComponent, title: 'Production function'},
  {path: 'ld01', component: LaborDemandComponent, title: 'Labor demand'},
  { path: 'unemployment', component: UnemployDataComponent, title: 'Unemployment data-grapher' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Chapter03RoutingModule { }
