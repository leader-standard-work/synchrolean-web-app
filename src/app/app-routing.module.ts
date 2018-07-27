import { NotificationsComponent } from './components/notifications/notifications.component';
import { TeamInfoComponent } from './components/team-info/team-info.component';
import { HomeComponent } from './components/home/home.component';
import { TaskPageComponent } from './components/task-page/task-page.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './task-form/task-form.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { InviteMemberComponent } from './components/invite-member/invite-member.component';

// Routes to different components go here.
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskPageComponent },
  { path: 'addtask', component: TaskFormComponent },
  { path: 'addaccount', component: AccountFormComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/new', component: TeamFormComponent },
  { path: 'teams/edit/:id', component: TeamFormComponent },
  { path: 'teams/:id', component: TeamInfoComponent },
  { path: 'teams/:id/invite', component: InviteMemberComponent },
  { path: 'notifications', component: NotificationsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
