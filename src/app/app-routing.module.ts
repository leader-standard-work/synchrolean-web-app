import { TasklistComponent } from './tasklist/tasklist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Routes to different components go here.
const routes: Routes = [
  { path: '', redirectTo: '/tasklist', pathMatch: 'full'},
  { path: 'tasklist', component: TasklistComponent }
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
