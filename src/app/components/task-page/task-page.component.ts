import { Component, OnInit } from '@angular/core';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit {
  pageTitle: string = ' My Tasks';         // Page title
  public tasks: Task[] = [];               // List of tasks from service
  public currentIndex: number = 0;         // The index of the currently referenced task from the list

  constructor(private taskService: TaskService) {
    console.log('TaskPageComponent: Created');
  }

  /**
   * After the TaskPageComponent has been created.. right before it
   * is displayed to the end user
   */
  ngOnInit() {
    console.log('TaskPageComponent: Fetching tasks');
    this.tasks = this.taskService.getTasks();
  }

  /**
   * Method for paying attention to which element in the list is currently
   * selected.
   * @param event Event emitter bound to the tasklist component in the view
   */
  change(event) {
    this.currentIndex = event;
    console.log(this.currentIndex);
  }
}
