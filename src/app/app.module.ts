import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TaskPageComponent } from './components/task-page/task-page.component';

// bootstrap related imports
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TeamInfoComponent } from './components/team-info/team-info.component';

@NgModule({
  declarations: [
    AppComponent,
    TasklistComponent,
    TaskFormComponent,
    TeamFormComponent,
    TeamListComponent,
    TaskPageComponent,
    HomeComponent,
    TeamInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
