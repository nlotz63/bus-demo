import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'POE: Dashboard' },
/*     { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'POE: supply/demand model' },
 */
    {
     path: 'Figure3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },


    // child routes for instructor view
    {
        path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'POE: Instructor Dashboard',
        loadChildren: () => [
             { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'POE: supply/demand model' },
            { path: 'Figure 3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },
        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
