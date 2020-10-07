import { Routes } from '@angular/router';

import { PasswordChangeComponent } from '../../auth/password-change/password-change.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { LogoutComponent } from '../../auth/logout/logout.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'change-password', component: PasswordChangeComponent }
];
