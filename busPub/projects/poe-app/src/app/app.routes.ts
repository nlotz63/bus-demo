import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'POE: Dashboard' },
    { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'POE: supply/demand model' },
    { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'POE: Budget constraint' },
    { path: 'interactive03', loadComponent: () => import('./interactive03/interactive03.component').then(m => m.Interactive03Component), title: 'POE: Consumer surplus' },
    { path: 'interactive04', loadComponent: () => import('./interactive04/interactive04.component').then(m => m.Interactive04Component), title: 'POE: Profit maximization' },
    { path: 'interactive05', loadComponent: () => import('./interactive5/interactive5.component').then(m => m.Interactive5Component), title: 'POE: Price ceilings and floors' },
    { path: 'interactive06', loadComponent: () => import('./interactive6/interactive6.component').then(m => m.Interactive6Component), title: 'POE: Gains from specialization' },
    { path: 'interactive07', loadComponent: () => import('./interactive7/interactive7.component').then(m => m.Interactive7Component), title: 'POE: Production possibilities curve' },
    { path: 'interactive08', loadComponent: () => import('./interactive8/interactive8.component').then(m => m.Interactive8Component), title: 'POE: Effects of tariffs' },
    { path: 'interactive09', loadComponent: () => import('./interactive09/interactive09.component').then(m => m.Interactive09Component), title: 'POE: Producer surplus' },
    { path: 'interactive10', loadComponent: () => import('./interactive10/interactive10.component').then(m => m.Interactive10Component), title: 'POE: Externalities' },
    { path: 'interactive11', loadComponent: () => import('./interactive11/interactive11.component').then(m => m.Interactive11Component), title: 'POE: Effects of taxes' },
    { path: 'interactive12', loadComponent: () => import('./interactive12/interactive12.component').then(m => m.Interactive12Component), title: 'POE: Marginal revenue & revenue' },
    { path: 'interactive13', loadComponent: () => import('./interactive13/interactive13.component').then(m => m.Interactive13Component), title: 'POE: Quantity and price effects' },
    { path: 'interactive14', loadComponent: () => import('./interactive14/interactive14.component').then(m => m.Interactive14Component), title: 'POE: Entry & exit' },
    { path: 'interactive15', loadComponent: () => import('./interactive15/interactive15.component').then(m => m.Interactive15Component), title: 'POE: PPF' },


    // child routes for instructor view
    {
        path: 'instructor-dashboard', loadComponent: () => import('./instructor-view/instructor-view.component').then(m => m.InstructorViewComponent), title: 'POE: Instructor Dashboard',
        loadChildren: () => [
            { path: 'interactive01', loadComponent: () => import('./interactive01/interactive01.component').then(m => m.Interactive01Component), title: 'POE: supply/demand model' },
            { path: 'interactive02', loadComponent: () => import('./interactive02/interactive02.component').then(m => m.Interactive02Component), title: 'POE: Budget constraint' },
            { path: 'interactive03', loadComponent: () => import('./interactive03/interactive03.component').then(m => m.Interactive03Component), title: 'POE: Consumer surplus' },
            { path: 'interactive04', loadComponent: () => import('./interactive04/interactive04.component').then(m => m.Interactive04Component), title: 'POE: Profit maximization' },
            { path: 'interactive05', loadComponent: () => import('./interactive5/interactive5.component').then(m => m.Interactive5Component), title: 'POE: Price ceilings and floors' },
            { path: 'interactive06', loadComponent: () => import('./interactive6/interactive6.component').then(m => m.Interactive6Component), title: 'POE: Gains from specialization' },
            { path: 'interactive07', loadComponent: () => import('./interactive7/interactive7.component').then(m => m.Interactive7Component), title: 'POE: Production possibilities curve' },
            { path: 'interactive08', loadComponent: () => import('./interactive8/interactive8.component').then(m => m.Interactive8Component), title: 'POE: Effects of tariffs' },
            { path: 'interactive09', loadComponent: () => import('./interactive09/interactive09.component').then(m => m.Interactive09Component), title: 'POE: Producer surplus' },
            { path: 'interactive10', loadComponent: () => import('./interactive10/interactive10.component').then(m => m.Interactive10Component), title: 'POE: Externalities' },
            { path: 'interactive11', loadComponent: () => import('./interactive11/interactive11.component').then(m => m.Interactive11Component), title: 'POE: Effects of taxes' },
            { path: 'interactive12', loadComponent: () => import('./interactive12/interactive12.component').then(m => m.Interactive12Component), title: 'POE: Marginal revenue & revenue' },
            { path: 'interactive13', loadComponent: () => import('./interactive13/interactive13.component').then(m => m.Interactive13Component), title: 'POE: Quantity and price effects' },
            { path: 'interactive14', loadComponent: () => import('./interactive14/interactive14.component').then(m => m.Interactive14Component), title: 'POE: Entry & exit' },
            { path: 'interactive15', loadComponent: () => import('./interactive15/interactive15.component').then(m => m.Interactive15Component), title: 'POE: PPF' },
        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
