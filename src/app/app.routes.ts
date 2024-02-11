import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.router').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'crm',
        loadChildren: () => import('./pages/crm/crm.router').then(m => m.CRM_ROUTES)
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    }
];
