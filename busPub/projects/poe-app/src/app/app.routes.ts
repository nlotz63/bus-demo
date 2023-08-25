import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'Equilibrium' },
    { path: 'interactive10', loadComponent: () => import('./interactive10/interactive10.component').then( m => m.Interactive10Component ), title: 'Equilibrium'},

];
