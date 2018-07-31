import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from './../../models/Task';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {
  public action: string;
  taskForm: FormGroup;    // Form
  @Input() taskId: number;
  @Output() addedTask = new EventEmitter<Task>();
  @Output() editedTask = new EventEmitter<Task>();

  /**
   * Communicates with the task service
   */
  constructor(private taskService: TaskService, 
    private authService: AuthService,
    private router: Router) { 
  }

  ngOnInit() {
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
    if (this.taskId) {
      this.action = 'Edit';
      this.taskService.getTaskById(this.taskId)
        .subscribe((task) => {
          this.taskForm.setValue({
            name: task.name,
            description: task.description,
            recurring: task.isRecurring
          });
        }, (err) => { console.log(err) });
    } else {
      this.action = 'Add';
    }
  }
  
  /**
   * When the component is destroyed
   */
  ngOnDestroy() {
    this.clear();
  }

  /**
   * Provides the task that the form is working with to the task
   * service so that the task can be added to the db. 
   * 
   * This is the most basic working example. From here we will want
   * to get validation going and include other fields on the form that
   * the user can manipulate. 
   */
  submit() {
    let task: Task = new Task();
    if (this.taskId) {
      task.id = this.taskId;
      task.ownerId = this.authService.getCurrentUserId();
      task.name = this.taskForm.controls['name'].value;
      task.description = this.taskForm.controls['description'].value;
      task.isRecurring = this.taskForm.controls['recurring'].value; 
      task.isCompleted = false;
      task.isRecurring = false;
      task.updatedDate = new Date();
      this.taskService.editTask(task)
        .subscribe((updatedTask) => {
          this.editedTask.emit(updatedTask);
          this.clear();
        }, (err) => { console.log(err) });
    } else {
      task.ownerId = this.authService.getCurrentUserId();
      task.name = this.taskForm.controls['name'].value;
      task.description = this.taskForm.controls['description'].value;
      task.isRecurring = this.taskForm.controls['recurring'].value;
      task.creationDate = new Date();
      task.isCompleted = false;
      task.isRecurring = false;
      this.taskService.addTask(task)
        .subscribe((newTask) => {
          this.addedTask.emit(newTask);
          this.clear();
        }, (err) => { console.log(err) });
    }
  }

  /**
   * Clears the form. Used for when the close or cancel button are clicked.
   */
  clear() {
    this.taskForm.reset();
  }
}
