import { TaskService } from './../services/task.service';
import { Component, OnInit } from '@angular/core';

import { Task } from './../models/Task';

@Component({
  selector: 'tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  // Array of tasks to be displayed in the list
  public tasks: Task[] = [];

  constructor(private taskService: TaskService) { 
    console.log("TasklistComponent created.");
  }

  /**
   * Right before the view is displayed to the end user we collect
   * the tasks for that user. We may want to change this so that
   * the task list takes, as input, the id of the user that is logged
   * in so that it can then fetch tasks based on that id.
   * 
   * Currently just takes a hardcoded id that is in my local DB. Change
   * this on your local machine to match an id you have in your DB.
   */
  ngOnInit() {
    // Grab the tasks from the task service
    this.tasks = this.taskService.fetchTasks(5);
    console.log(this.tasks);
  }
}