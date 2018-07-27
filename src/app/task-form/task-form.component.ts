import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../models/Task';
import { TaskService } from '../services/task.service';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm:FormGroup;    // Form

  /**
   * Communicates with the task service
   */
  constructor(private taskService: TaskService, 
    private authService: AuthService,
    private router: Router) { 

  }

  ngOnInit() {
    this.taskForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(40)
      ]),
      description: new FormControl('', [
        Validators.maxLength(250)
      ]),
      recurring: new FormControl(false)
    });
  }

  /**
   * Provides the task that the form is working with to the task
   * service so that the task can be added to the db. 
   * 
   * This is the most basic working example. From here we will want
   * to get validation going and include other fields on the form that
   * the user can manipulate. 
   */
  addTask() {
    let task = new Task();
    task.name = this.taskForm.controls['name'].value;
    task.description = this.taskForm.controls['description'].value;
    task.isRecurring = this.taskForm.controls['recurring'].value;
    task.ownerId = this.authService.getCurrentUserId();
    console.log(task);
    this.taskService.addTask(task);
    this.router.navigate(['/tasks']);
  }
}
