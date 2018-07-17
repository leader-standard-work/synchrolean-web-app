import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../models/Task';
import { TaskService } from '../services/task.service';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm:FormGroup;

  /**
   * Communicates with the task service
   */
  constructor(private taskService:TaskService, 
    private accountsService:AccountService,
    private router:Router,
    private formBuilder:FormBuilder) { 

  }

  ngOnInit() {
    this.taskForm = this.formBuilder.group({
      taskName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]],
      description: ['', [
        Validators.maxLength(250)
      ]],
      recurring: [false, [
        Validators.required
      ]]
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
    task.name = this.taskForm.controls['taskName'].value;
    task.description = this.taskForm.controls['description'].value;
    task.creationDate = new Date();
    task.isCompleted = false;
    task.isRemoved = false;
    task.ownerId = 4;
    this.taskService.addTask(task);
    this.router.navigate(['/tasklist']);
  }

  /**
   * Used to grab form properties to display useful messages to the
   * end user.
   * @returns The name entered for the task
   */
  get taskName() {
    return this.taskForm.get('taskName');
  }

  /**
   * Used to grab form properties to display useful messages to the
   * end user.
   * @returns The description entered for the task
   */
  get description() {
    return this.taskForm.get('description');
  }

}
