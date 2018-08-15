import { JwtInterceptor } from './helpers/jwt.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TaskPageComponent } from './components/task-page/task-page.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

// bootstrap related imports
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccountFormComponent } from './account-form/account-form.component';
import { TeamInfoComponent } from './components/team-info/team-info.component';
import { InviteMemberComponent } from './components/invite-member/invite-member.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskInfoComponent } from './components/task-info/task-info.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PermissionsComponent } from './components/permissions/permissions.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TeamFormComponent,
    TeamListComponent,
    TaskPageComponent,
    HomeComponent,
    InviteMemberComponent,
    TeamInfoComponent,
    NotificationsComponent,
    AccountFormComponent,
    TaskListComponent,
    TaskInfoComponent,
    LoginFormComponent,
    SidebarComponent,
    PermissionsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule,
    BsDropdownModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
