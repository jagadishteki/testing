import { Route } from "@angular/router";
import { CrmComponent } from "./crm.component";


export const CRM_ROUTES: Route[] = [
    {
        path: '',
        component: CrmComponent,
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: '',
                redirectTo: '/crm/dashboard',
                pathMatch: 'full'
            }
        ]
    }
]