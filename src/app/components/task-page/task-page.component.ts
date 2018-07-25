import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';
import { TasklistComponent } from '../../tasklist/tasklist.component';

@Component({
  selector: 'app-task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, AfterViewInit {
  pageTitle: string = ' My Tasks';         // Page title
  public tasks: Task[] = [];               // List of tasks from service
  public current: number;                  // The index of the currently referenced task from the list
  @ViewChild(TasklistComponent) taskList;  // Child list component

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
   * In order to get the current task that is being referenced in the child
   * component we implement ngAfterViewInit so that we can gain access to the
   * properties of the child component.
   */
  ngAfterViewInit() {
    //this.currentTask = new Task();
    this.current = this.taskList.current;
    console.log(this.current);
  }

}
