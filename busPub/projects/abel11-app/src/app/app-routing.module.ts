import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Dashboard' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'module01/key-diagram1', loadComponent: () => import('./chapter03/production-function/production-function.component').then(mod => mod.ProductionFunctionComponent), title: 'Production function' },
  { path: 'module01/key-diagram2', loadComponent: () => import('./chapter03/labor-demand/labor-demand.component').then(mod => mod.LaborDemandComponent), title: 'Labor demand' },
  { path: 'module01/figure3.15', loadComponent: () => import('./chapter03/unemploy-data/unemploy-data.component').then(mod => mod.UnemployDataComponent), title: 'Unemployment data-grapher' },
  { path: 'module02/key-diagram3', loadComponent: () => import('./module2/key-diagram3/key-diagram3.component').then(m => m.KeyDiagram3Component), title: 'National Saving Model' },
  { path: 'module02/key-diagram4', loadComponent: () => import('./module2/key-diagram4/key-diagram4.component').then(m => m.KeyDiagram4Component), title: 'National Saving (small open economy) Model' },
  { path: 'module02/key-diagram5', loadComponent: () => import('./module2/key-diagram5/key-diagram5.component').then(m => m.KeyDiagram5Component), title: 'National Saving (large open economy) Model' },
  { path: 'module02/figure6.5', loadComponent: () => import('./module2/solow/solow.component').then(mod => mod.SolowComponent), title: 'Solow model' },
  { path: 'module03/key-diagram6', loadComponent: () => import('./module3/key-diagram6/key-diagram6.component').then(mod => mod.KeyDiagram6Component), title: 'ISLM model' },
  { path: 'module03/key-diagram7', loadComponent: () => import('./module3/key-diagram7/key-diagram7.component').then(mod => mod.KeyDiagram7Component), title: 'AD/AS model' },
  { path: 'module03/key-diagram8', loadComponent: () => import('./module3/key-diagram8/key-diagram8.component').then(mod => mod.KeyDiagram8Component), title: 'AD/AS (misperceptions)' },
  { path: 'module03/figure9.2', loadComponent: () => import('./module3/fig92/fig92.component').then(m => m.Fig92Component), title: 'Derive IS curve' },
  { path: 'module03/figure9.4', loadComponent: () => import('./module3/fig94/fig94.component').then(m => m.Fig94Component), title: 'Derive LM curve' },
  { path: 'module04/figure13.4', loadComponent: () => import('./module4/fig134/fig134.component').then(m => m.Fig134Component), title: 'Supply/demand for currency' },
  { path: 'module04/figure13.5', loadComponent: () => import('./module4/fig135/fig135.component').then(m => m.Fig135Component), title: 'Goods market (open economy)' },
  { path: 'module04/figure13.9', loadComponent: () => import('./module4/fig139/fig139.component').then(m => m.Fig139Component), title: 'Open economy ISLM' },
  {
    path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'Instructor dashboard',
    loadChildren: () => [
      { path: 'key-diagram1', loadComponent: () => import('./chapter03/production-function/production-function.component').then(mod => mod.ProductionFunctionComponent), title: 'Production function' },
      { path: 'key-diagram2', loadComponent: () => import('./chapter03/labor-demand/labor-demand.component').then(mod => mod.LaborDemandComponent), title: 'Labor demand' },
      { path: 'figure3.15', loadComponent: () => import('./chapter03/unemploy-data/unemploy-data.component').then(mod => mod.UnemployDataComponent), title: 'Unemployment data-grapher' },
      { path: 'key-diagram3', loadComponent: () => import('./module2/key-diagram3/key-diagram3.component').then(m => m.KeyDiagram3Component), title: 'National Saving Model' },
      { path: 'key-diagram4', loadComponent: () => import('./module2/key-diagram4/key-diagram4.component').then(m => m.KeyDiagram4Component), title: 'National Saving (small open economy) Model' },
      { path: 'key-diagram5', loadComponent: () => import('./module2/key-diagram5/key-diagram5.component').then(m => m.KeyDiagram5Component), title: 'National Saving (large open economy) Model' },
      { path: 'figure6.5', loadComponent: () => import('./module2/solow/solow.component').then(mod => mod.SolowComponent), title: 'Solow model' },
      { path: 'module03/key-diagram6', loadComponent: () => import('./module3/key-diagram6/key-diagram6.component').then(mod => mod.KeyDiagram6Component), title: 'ISLM model' },
      { path: 'key-diagram7', loadComponent: () => import('./module3/key-diagram7/key-diagram7.component').then(mod => mod.KeyDiagram7Component), title: 'AD/AS model' },
      { path: 'key-diagram8', loadComponent: () => import('./module3/key-diagram8/key-diagram8.component').then(mod => mod.KeyDiagram8Component), title: 'AD/AS (misperceptions)' },
      { path: 'figure9.2', loadComponent: () => import('./module3/fig92/fig92.component').then(m => m.Fig92Component), title: 'Derive IS curve' },
      { path: 'figure9.4', loadComponent: () => import('./module3/fig94/fig94.component').then(m => m.Fig94Component), title: 'Derive LM curve' },
      { path: 'figure13.4', loadComponent: () => import('./module4/fig134/fig134.component').then(m => m.Fig134Component), title: 'Supply/demand for currency' },
      { path: 'figure13.5', loadComponent: () => import('./module4/fig135/fig135.component').then(m => m.Fig135Component), title: 'Goods market (open economy)' },
      { path: 'figure13.9', loadComponent: () => import('./module4/fig139/fig139.component').then(m => m.Fig139Component), title: 'Open economy ISLM' },
        ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
