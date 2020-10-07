import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LogoutComponent } from '../../auth/logout/logout.component';
import { Ng2CompleterModule } from "ng2-completer";
import { ModalModule } from 'ngb-modal';

@NgModule({
  imports: [
    DragDropModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    Ng2CompleterModule,
    NgbModule,
    ModalModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    LogoutComponent,
    DashboardComponent,

  ],
})

export class AdminLayoutModule { }
