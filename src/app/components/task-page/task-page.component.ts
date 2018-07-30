import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';

@Component({
  selector: 'task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  public pageTitle: string = 'My Tasks';  // Page title
  public tasks: Task[] = [];              // List of tasks from service
  public currentIndex: number = 0;        // The index of the currently referenced task from the list
  taskForm: FormGroup;                    // Form for entering a new task
  public complete: string = 'Done';
  public incomplete: string = 'In-Progress';

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
   * Navigate to the add task form. This will likely change in location.
   */
  addTask() {
    this.taskService.updateObservableState(this.tasks);
    this.router.navigate(['/addtask']);
  }

  editTask(index: number) {
    console.log(index);
  }

  ngOnDestroy() {

  }
}
