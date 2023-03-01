import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'module01', loadChildren: () => import('./chapter03/chapter03.module').then(m => m.Chapter03Module) },
  { path: 'module02', loadChildren: () => import('./module2/module2.module').then(m => m.Module2Module) },
  { path: 'module03' , loadChildren: () => import('./module3/module3.module').then(m => m.Module3Module) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule ), title: 'Dashboard' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
