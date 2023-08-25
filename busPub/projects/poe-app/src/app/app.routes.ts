import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'AL03: Dashboard' },
    { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'AL03: supply/demand model' },
    { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'AL03: Budget constraint' },
    { path: 'interactive03', loadComponent: () => import('./interactive03/interactive03.component').then(m => m.Interactive03Component), title: 'AL03: Consumer surplus' },
    { path: 'interactive04', loadComponent: () => import('./interactive04/interactive04.component').then(m => m.Interactive04Component), title: 'AL03: Profit maximization' },
    { path: 'interactive05', loadComponent: () => import('./interactive5/interactive5.component').then(m => m.Interactive5Component), title: 'AL03: Price ceilings and floors' },
    { path: 'interactive06', loadComponent: () => import('./interactive6/interactive6.component').then(m => m.Interactive6Component), title: 'AL03: Gains from specialization' },
    { path: 'interactive07', loadComponent: () => import('./interactive7/interactive7.component').then(m => m.Interactive7Component), title: 'AL03: Production possibilities curve' },
    { path: 'interactive08', loadComponent: () => import('./interactive8/interactive8.component').then(m => m.Interactive8Component), title: 'AL03: Effects of tariffs' },
    { path: 'interactive09', loadComponent: () => import('./interactive09/interactive09.component').then(m => m.Interactive09Component), title: 'AL03: Producer surplus' },
    { path: 'interactive10', loadComponent: () => import('./interactive10/interactive10.component').then(m => m.Interactive10Component), title: 'ALL03: Externalities' },
    { path: 'interactive11', loadComponent: () => import('./interactive11/interactive11.component').then(m => m.Interactive11Component), title: 'ALL03: Effects of taxes' },
    { path: 'interactive12', loadComponent: () => import('./interactive12/interactive12.component').then(m => m.Interactive12Component), title: 'ALL03: Marginal revenue & revenue' },
    { path: 'interactive13', loadComponent: () => import('./interactive13/interactive13.component').then(m => m.Interactive13Component), title: 'ALL03: Quantity and price effects' },
    { path: 'interactive14', loadComponent: () => import('./interactive14/interactive14.component').then(m => m.Interactive14Component), title: 'ALL03: Entry & exit' },

    // child routes for instructor view
    {
        path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'POE: Instructor Dashboard',
        loadChildren: () => [
            { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'AL03: supply/demand model' },
            { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'AL03: Budget constraint' },
            { path: 'interactive03', loadComponent: () => import('./interactive03/interactive03.component').then(m => m.Interactive03Component), title: 'AL03: Consumer surplus' },
            { path: 'interactive04', loadComponent: () => import('./interactive04/interactive04.component').then(m => m.Interactive04Component), title: 'AL03: Profit maximization' },
            { path: 'interactive05', loadComponent: () => import('./interactive5/interactive5.component').then(m => m.Interactive5Component), title: 'AL03: Price ceilings and floors' },
            { path: 'interactive06', loadComponent: () => import('./interactive6/interactive6.component').then(m => m.Interactive6Component), title: 'AL03: Gains from specialization' },
            { path: 'interactive07', loadComponent: () => import('./interactive7/interactive7.component').then(m => m.Interactive7Component), title: 'AL03: Production possibilities curve' },
            { path: 'interactive08', loadComponent: () => import('./interactive8/interactive8.component').then(m => m.Interactive8Component), title: 'AL03: Effects of tariffs' },
            { path: 'interactive09', loadComponent: () => import('./interactive09/interactive09.component').then(m => m.Interactive09Component), title: 'AL03: Producer surplus' },
            { path: 'interactive10', loadComponent: () => import('./interactive10/interactive10.component').then(m => m.Interactive10Component), title: 'ALL03: Externalities' },
            { path: 'interactive11', loadComponent: () => import('./interactive11/interactive11.component').then(m => m.Interactive11Component), title: 'ALL03: Effects of taxes' },
            { path: 'interactive12', loadComponent: () => import('./interactive12/interactive12.component').then(m => m.Interactive12Component), title: 'ALL03: Marginal revenue & revenue' },
            { path: 'interactive13', loadComponent: () => import('./interactive13/interactive13.component').then(m => m.Interactive13Component), title: 'ALL03: Quantity and price effects' },
            { path: 'interactive14', loadComponent: () => import('./interactive14/interactive14.component').then(m => m.Interactive14Component), title: 'ALL03: Entry & exit' },
        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
