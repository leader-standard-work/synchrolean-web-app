import { TeamListComponent } from './components/team-list/team-list.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskFormComponent } from './task-form/task-form.component';
import { TeamFormComponent } from './components/team-form/team-form.component';

// Routes to different components go here.
const routes: Routes = [
  { path: '', redirectTo: '/tasklist', pathMatch: 'full'},
  { path: 'tasklist', component: TasklistComponent },
  { path: 'addtask', component: TaskFormComponent },
  { path: 'teams', component: TeamListComponent },
  { path: 'teams/new', component: TeamFormComponent },
  { path: 'teams/edit/:id', component: TeamFormComponent }
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
