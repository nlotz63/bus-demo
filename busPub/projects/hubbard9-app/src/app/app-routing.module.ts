import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/module01/figure3.1', pathMatch: 'full' },
  { path: 'module01/figure3.1', loadComponent: () => import('./module1/figure31/figure31.component').then(m => m.Figure31Component) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
