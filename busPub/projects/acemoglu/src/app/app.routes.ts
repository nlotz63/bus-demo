import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then( m => m.DashboardComponent), title: 'Dashboard'},
  { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'supply/demand model' },
  { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'Budget constraint' },
  { path: 'interactive03', loadComponent: () => import('./interactive03/interactive03.component').then(m => m.Interactive03Component), title: 'Consumer surplus' },
  { path: 'interactive04', loadComponent: () => import('./interactive04/interactive04.component').then(m => m.Interactive04Component), title: 'Profit maximization' },
  { path: 'interactive05', loadComponent: () => import('./interactive5/interactive5.component').then( m => m.Interactive5Component), title: 'Price ceilings and floors'},
  { path: 'interactive06', loadComponent: () => import('./interactive6/interactive6.component').then(m => m.Interactive6Component), title: 'Gains from specialization' },
  { path: 'interactive07', loadComponent: () => import('./interactive7/interactive7.component').then( m => m.Interactive7Component), title: 'Production possibilities curve'},
  { path: 'interactive08', loadComponent: () => import('./interactive8/interactive8.component').then( m => m.Interactive8Component), title: 'Effects of tariffs'},
  { path: '', pathMatch: 'full', redirectTo: '/dashboard'}
];
