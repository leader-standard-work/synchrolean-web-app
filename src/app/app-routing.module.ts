import { AuthGuard } from './guards/auth.guard';
import { TaskInfoComponent } from './components/task-info/task-info.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { TeamInfoComponent } from './components/team-info/team-info.component';
import { HomeComponent } from './components/home/home.component';
import { TaskPageComponent } from './components/task-page/task-page.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { InviteMemberComponent } from './components/invite-member/invite-member.component';
import { RollupComponent } from './components/rollup/rollup.component';
import { TeamMetricsComponent } from './components/team-metrics/team-metrics.component';

// Routes to different components go here.
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskPageComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id', component: TaskInfoComponent, canActivate: [AuthGuard] },
  { path: 'addtask', component: TaskFormComponent, canActivate: [AuthGuard] },
  { path: 'teams', component: TeamListComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  { path: 'teams/new', component: TeamFormComponent, canActivate: [AuthGuard] },
  { path: 'teams/edit/:id', component: TeamFormComponent, canActivate: [AuthGuard] },
  { path: 'teams/:id', component: TeamInfoComponent, canActivate: [AuthGuard] },
  { path: 'teams/:id/invite', component: InviteMemberComponent, canActivate: [AuthGuard] },
  { path: 'teams/:id/metrics', component: TeamMetricsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'users/:email/tasks', component: TaskPageComponent, canActivate: [AuthGuard] },
  { path: 'rollup/:id', component: RollupComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
