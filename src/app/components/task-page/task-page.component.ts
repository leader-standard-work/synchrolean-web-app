import { Component, OnInit, OnDestroy } from '@angular/core';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  // public pageTitle: string = this.authService.getCurrentUserName();  // Page title
  public tasks: Task[] = [];              // List of tasks from service
  public complete: string = 'Complete';
  public incomplete: string = 'Incomplete';
  public userMetrics: number;
  public teamMetrics: number;

  constructor(private taskService: TaskService,
    private authService: AuthService) {
    console.log('TaskPageComponent: Created');
  }

  /**
   * After the TaskPageComponent has been created.. right before it
   * is displayed to the end user
   */
  ngOnInit() {
    console.log('TaskPageComponent: Fetching tasks');
    this.getAllTasks();
    this.getWeeklyUserMetrics();
    this.getWeeklyTeamMetrics();
  }

  ngOnDestroy() {
    
  }

  /**
   * Get all tasks for the current user
   */
  getAllTasks() {
    console.log('TaskPageComponent: Getting all tasks');
    this.taskService.getAllTasks()
      .subscribe((tasks) => {
        this.tasks = tasks;
      }, (err) => { console.log(err) });
  }

  /**
   * Adds a new task to the list
   * @param newTask The new task to add to the list
   */
  onTaskAdded(newTask: Task) {
    console.log('TaskPageComponent: Adding task and updating observable state');
    this.tasks.push(newTask);
    this.taskService.updateObservableState(this.tasks);
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyUserMetrics() {
    console.log('TaskPageComponent: Getting weekly user metrics');
    this.taskService.getWeeklyTaskMetrics(this.authService.getEmail())
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.userMetrics = metrics;
        } else {
          this.userMetrics = 0;
        }
      }, (err) => {
        this.userMetrics = 0;
      });
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyTeamMetrics() {
    console.log('TaskPageComponent: Getting weekly team metrics');
    this.taskService.getWeeklyTeamMetrics(this.authService.getEmail())
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.teamMetrics = metrics;
        } else {
          this.teamMetrics = 0;
        }
      }, (err) => {
        this.teamMetrics = 0; // Until the call is actually working
      });
  }
}
