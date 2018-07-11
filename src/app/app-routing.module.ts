import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Routes to different components go here.
const routes: Routes = [

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
