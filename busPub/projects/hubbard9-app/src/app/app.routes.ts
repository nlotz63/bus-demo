import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'HO: Dashboard' },
    { path: 'Figure3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },
    { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'HO: supply/demand model' },
    { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'HO: PPF Model' },
    { path: 'interactive03', loadComponent: () => import('./interactive-ho03/interactive-ho03.component').then(m => m.InteractiveHO03Component), title: 'HO: comparative advantage' },


    // child routes for instructor view
    {
        path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'POE: Instructor Dashboard',
        loadChildren: () => [
            { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'HO: supply/demand model' },
            { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'HO: PPF Model' },
            { path: 'interactive03', loadComponent: () => import('./interactive-ho03/interactive-ho03.component').then(m => m.InteractiveHO03Component), title: 'HO: comparative advantage' },
            { path: 'Figure 3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },

        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
