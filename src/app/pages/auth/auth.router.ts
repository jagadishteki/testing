import { Route } from "@angular/router";
import { AuthComponent } from "./auth.component";

// In auth/routes.ts:
export const AUTH_ROUTES: Route[] = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path: '',
        component: AuthComponent,
        children: [
            { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
            { path: 'signup', loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent) }

        ]
    }
    // {path: 'users', component: AdminUsersComponent},
    // ...
];