import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/ch03/unemployment', pathMatch: 'full' },
  {path: 'ch03', loadChildren: () => import('./chapter03/chapter03.module').then(m => m.Chapter03Module) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
