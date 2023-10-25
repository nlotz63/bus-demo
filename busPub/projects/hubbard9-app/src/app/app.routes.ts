import { Macro01hoComponent } from './macro01ho/macro01ho.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'HO: Dashboard' },
    { path: 'Figure3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },
    { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'HO: supply/demand model' },
    { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'HO: PPF Model' },
    { path: 'interactive03', loadComponent: () => import('./interactive-ho03/interactive-ho03.component').then(m => m.InteractiveHO03Component), title: 'HO: comparative advantage' },
    { path: 'interactive04', loadComponent: () => import('./interactiveho04/interactiveho04.component').then(m => m.Interactiveho04Component), title: 'HO: consumer and producer surplus' },
    { path: 'interactive05', loadComponent: () => import('./interactive05/interactive05.component').then(m => m.Interactive05Component), title: 'HO: Price ceilings and floors' },
    { path: 'interactive06', loadComponent: () => import('./interactiveho06/interactiveho06.component').then(m => m.Interactiveho06Component), title: 'HO: Externalities' },
    { path: 'interactive07', loadComponent: () => import('./interactiveho07/interactiveho07.component').then( m => m.Interactiveho07Component), title: 'HO: '},
    { path: 'macrointeractive01', loadComponent: () => import('./macro01ho/macro01ho.component').then( m => m.Macro01hoComponent), title: 'HO: Expenditure model'},


    // child routes for instructor view
    {
        path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'POE: Instructor Dashboard',
        loadChildren: () => [
            { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'HO: supply/demand model' },
            { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'HO: PPF Model' },
            { path: 'interactive03', loadComponent: () => import('./interactive-ho03/interactive-ho03.component').then(m => m.InteractiveHO03Component), title: 'HO: comparative advantage' },
            { path: 'Figure 3.1', loadComponent: () => import('./figure31/figure31.component').then(m => m.Figure31Component), title: 'HO: Demand Schedule' },
            { path: 'interactive04', loadComponent: () => import('./interactiveho04/interactiveho04.component').then(m => m.Interactiveho04Component), title: 'HO: consumer and producer surplus' },
            { path: 'interactive05', loadComponent: () => import('./interactive05/interactive05.component').then(m => m.Interactive05Component), title: 'HO: Price ceilings and floors' },
            { path: 'interactive06', loadComponent: () => import('./interactiveho06/interactiveho06.component').then(m => m.Interactiveho06Component), title: 'HO: Externalities' },
            { path: 'interactive07', loadComponent: () => import('./interactiveho07/interactiveho07.component').then( m => m.Interactiveho07Component), title: 'HO: '},
        
            { path: 'macrointeractive01', loadComponent: () => import('./macro01ho/macro01ho.component').then( m => m.Macro01hoComponent), title: 'HO: Expenditure model'},


        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
