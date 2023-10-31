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
    { path: 'interactive07', loadComponent: () => import('./interactiveho07/interactiveho07.component').then(m => m.Interactiveho07Component), title: 'HO: Optimal pollution reduction' },
    { path: 'interactive08', loadComponent: () => import('./interactiveho08/interactiveho08.component').then(m => m.Interactiveho08Component), title: 'HO: Elasticity calculator' },
    { path: 'interactive09', loadComponent: () => import('./interactiveho09/interactiveho09.component').then(m => m.Interactiveho09Component), title: 'HO: Effects of tariffs' },
    { path: 'interactive10', loadComponent: () => import('./interactiveho10/interactiveho10.component').then(m => m.Interactiveho10Component), title: 'HO: Competitive models' },
    { path: 'interactive11', loadComponent: () => import('./interactiveho11/interactiveho11.component').then(m => m.Interactiveho11Component), title: 'HO: Effects of entry on profit' },
    { path: 'interactive12', loadComponent: () => import('./interactiveho12/interactiveho12.component').then(m => m.Interactiveho12Component), title: 'HO: Monopoly model' },
    { path: 'interactive13', loadComponent: () => import('./interactiveho13/interactiveho13.component').then(m => m.Interactiveho13Component), title: 'HO: Effect of taxes' },
    { path: 'macrointeractive01', loadComponent: () => import('./macro01ho/macro01ho.component').then(m => m.Macro01hoComponent), title: 'HO: Expenditure model' },
    { path: 'macrointeractive02', loadComponent: () => import('./macro02ho/macro02ho.component').then(m => m.Macro02hoComponent), title: 'HO: Loanable funds market' },
    { path: 'macrointeractive03', loadComponent: () => import('./macro03ho/macro03ho.component').then(m => m.Macro03hoComponent), title: 'HO: Production function' },
    { path: 'macrointeractive04', loadComponent: () => import('./macro04ho/macro04ho.component').then(m => m.Macro04hoComponent), title: 'HO: AD/AS model' },
    { path: 'macrointeractive05', loadComponent: () => import('./macro05ho/macro05ho.component').then(m => m.Macro05hoComponent), title: 'HO: Federal funds market' },
    { path: 'macrointeractive06', loadComponent: () => import('./macro06ho/macro06ho.component').then(m => m.Macro06hoComponent), title: 'HO: Philips curve' },
    { path: 'macrointeractive07', loadComponent: () => import('./macro07ho/macro07ho.component').then(m => m.Macro07hoComponent), title: 'HO: Foreign exchange market' },
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
            { path: 'interactive07', loadComponent: () => import('./interactiveho07/interactiveho07.component').then(m => m.Interactiveho07Component), title: 'HO: Optimal pollution reduction' },
            { path: 'interactive08', loadComponent: () => import('./interactiveho08/interactiveho08.component').then(m => m.Interactiveho08Component), title: 'HO: Elasticity calculator' },
            { path: 'interactive09', loadComponent: () => import('./interactiveho09/interactiveho09.component').then(m => m.Interactiveho09Component), title: 'HO: Effects of tariffs' },
            { path: 'interactive10', loadComponent: () => import('./interactiveho10/interactiveho10.component').then(m => m.Interactiveho10Component), title: 'HO: Competitive models' },
            { path: 'interactive11', loadComponent: () => import('./interactiveho11/interactiveho11.component').then(m => m.Interactiveho11Component), title: 'HO: Effects of entry on profit' },
            { path: 'interactive12', loadComponent: () => import('./interactiveho12/interactiveho12.component').then(m => m.Interactiveho12Component), title: 'HO: Monopoly model' },
            { path: 'interactive13', loadComponent: () => import('./interactiveho13/interactiveho13.component').then(m => m.Interactiveho13Component), title: 'HO: Efficet of taxes' },
            { path: 'macrointeractive01', loadComponent: () => import('./macro01ho/macro01ho.component').then(m => m.Macro01hoComponent), title: 'HO: Expenditure model' },
            { path: 'macrointeractive02', loadComponent: () => import('./macro02ho/macro02ho.component').then(m => m.Macro02hoComponent), title: 'HO: Loanable funds market' },
            { path: 'macrointeractive03', loadComponent: () => import('./macro03ho/macro03ho.component').then(m => m.Macro03hoComponent), title: 'HO: Production function' },
            { path: 'macrointeractive04', loadComponent: () => import('./macro04ho/macro04ho.component').then(m => m.Macro04hoComponent), title: 'HO: AD/AS model' },
            { path: 'macrointeractive05', loadComponent: () => import('./macro05ho/macro05ho.component').then(m => m.Macro05hoComponent), title: 'HO: Federal funds market' },
            { path: 'macrointeractive06', loadComponent: () => import('./macro06ho/macro06ho.component').then(m => m.Macro06hoComponent), title: 'HO: Philips curve' },
            { path: 'macrointeractive07', loadComponent: () => import('./macro07ho/macro07ho.component').then(m => m.Macro07hoComponent), title: 'HO: Foreign exchange market' },

        ]
    },

    { path: '', pathMatch: 'full', redirectTo: '/dashboard' }
];
