import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit {
  pageTitle: string = ' My Tasks';         // Page title
  public tasks: Task[] = [];               // List of tasks from service
  public currentIndex: number = 0;         // The index of the currently referenced task from the list

  constructor(private taskService: TaskService,
    private router: Router) {
    console.log('TaskPageComponent: Created');
  }

  /**
   * After the TaskPageComponent has been created.. right before it
   * is displayed to the end user
   */
  ngOnInit() {
    console.log('TaskPageComponent: Fetching tasks');
    this.getAllTasks();
  }

  /**
   * Method for paying attention to which element in the list is currently
   * selected.
   * @param event Event emitter bound to the tasklist component in the view
   */
  change(event) {
    this.currentIndex = event;
  }

  /**
   * Get the current user's completed tasks
   */
  getCompletedTasks() {
    console.log('TaskPageComponent: Getting completed tasks');
    this.tasks = this.taskService.getCompletedTasks();
  }

  /**
   * Get the current user's unfinished tasks
   */
  getUnfinishedTasks() {
    console.log('TaskPageComponent: Getting unfinished tasks');
    this.tasks = this.taskService.getUnfinishedTasks();
  }

  /**
   * Get all tasks for the current user
   */
  getAllTasks() {
    console.log('TaskPageComponent: Getting all tasks');
    this.tasks = this.taskService.getAllTasks();
  }

  /**
   * Navigate to the add task form. This will likely change in location.
   */
  addTask() {
    this.router.navigate(['/addtask']);
  }
}
