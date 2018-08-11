import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  public pageTitle: string = this.authService.getCurrentUserName();  // Page title
  public tasks: Task[] = [];              // List of tasks from service
  public currentIndex: number = 0;        // The index of the currently referenced task from the list
  public complete: string = 'Done';
  public incomplete: string = 'In-Progress';

  constructor(private taskService: TaskService,
    private authService: AuthService,
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
   * Get all tasks for the current user
   */
  getAllTasks() {
    console.log('TaskPageComponent: Getting all tasks');
    this.taskService.getAllTasks()
      .subscribe((tasks) => {
        console.log(tasks);
        this.tasks = tasks;
      }, (err) => { console.log(err) });
  }

  editTask(index: number) {
    this.currentIndex = index;
  }

  /**
   * Marks a task as complete and calls edit task to mark it complete
   * on the backend
   * @param index The index of the task that we are completing
   */
  completeTask(index: number) {
    this.tasks[index].isCompleted = true;
    this.taskService.editTask(this.tasks[index])
      .subscribe((updatedTask) => {
        this.tasks[index] = updatedTask;
        this.taskService.updateObservableState(this.tasks);
      }, (err) => { console.log(err) });
  }

  /**
   * Adds a new task to the list
   * @param newTask The new task to add to the list
   */
  onTaskAdded(newTask: Task) {
    console.log(newTask);
    this.tasks.push(newTask);
    this.taskService.updateObservableState(this.tasks);
  }

  ngOnDestroy() {
    
  }
}
