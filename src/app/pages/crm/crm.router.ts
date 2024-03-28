import { Route } from "@angular/router";
import { CrmComponent } from "./crm.component";


export const CRM_ROUTES: Route[] = [
    {
        path: '',
        component: CrmComponent,
        children: [
            {
                path: '',
                redirectTo: '/crm/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'contacts',
                loadComponent: () => import('./contacts/contacts.component').then(c => c.ContactsComponent)
            },
            {
                path: 'contact-groups',
                loadComponent: () => import('./contact-groups/contact-groups.component').then(c => c.ContactGroupsComponent)
            },
            {
                path: 'manage-campaigns',
                loadComponent: () => import('./manage-campaigns/manage-campaigns.component').then(c => c.ManageCampaignsComponent)
            },
            {
                path: 'contact-admin',
                loadComponent: () => import('./contact-admin/contact-admin.component').then(c => c.ContactAdminComponent)
            },
            {
                path: 'ngx-editor',
                loadComponent: () => import('./ngx-editor/ngx-editor.component').then(c => c.NgxEditorComponent)
            }
        ]
    }
]