import { TaskService } from './../services/task.service';
import { Component, OnInit } from '@angular/core';

import { Task } from './../models/Task';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  public tasks: Task[] = [];

  constructor(private taskService: TaskService) { 
    console.log("TasklistComponent created.");
  }

  // When the component is initialized right before display
  ngOnInit() {
    // Grab the tasks from the task service
    this.tasks = this.taskService.getTasks();
  }
}
