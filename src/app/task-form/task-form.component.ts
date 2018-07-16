import { Component, OnInit } from '@angular/core';

import { Task } from './../models/Task';
import { TaskService } from './../services/task.service';
import { AccountsService } from './../services/accounts.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  action:string = 'Add';
  task: Task;

  /**
   * Communicates with the task service
   */
  constructor(private taskService:TaskService, private accountsService:AccountsService) { 
    this.task = new Task();
  }

  ngOnInit() {
  }

  /**
   * Provides the task that the form is working with to the task
   * service so that the task can be added to the db.
   */
  addTask() {
    this.task.creationDate = new Date();
    this.task.isCompleted = false;
    this.task.isRemoved = false;
    this.task.ownerId = 5;
    this.taskService.addTask(this.task);
  }

}
