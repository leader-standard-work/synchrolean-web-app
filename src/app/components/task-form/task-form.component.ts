import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  taskForm:FormGroup;    // Form
  @Input() taskList: Task[];
  @Input() taskIndex: number;

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
    if (this.taskIndex > -1) {
      this.taskForm.setValue({
        name: this.taskList[this.taskIndex].name,
        description: this.taskList[this.taskIndex].description,
        recurring: this.taskList[this.taskIndex].isRecurring
      });
    }
  }
  
  /**
   * When the component is destroyed
   */
  ngOnDestroy() {
    this.taskForm.reset();
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
    if (this.taskIndex > -1) {
      let task: Task = this.taskList[this.taskIndex];
      task.name = this.taskForm.controls['name'].value;
      task.description = this.taskForm.controls['description'].value;
      task.isRecurring = this.taskForm.controls['recurring'].value; 
      task.isCompleted = false;
      task.isRecurring = false;
      this.taskService.editTask(task)
        .subscribe((updatedTask) => {
          this.taskList[this.taskIndex] = updatedTask;
          this.taskService.updateObservableState(this.taskList);
          this.clear();
        }, (err) => { console.log(err) });
    } else {
      let task: Task = new Task();
      task.ownerId = this.authService.getCurrentUserId();
      task.name = this.taskForm.controls['name'].value;
      task.description = this.taskForm.controls['description'].value;
      task.isRecurring = this.taskForm.controls['recurring'].value;
      task.creationDate = new Date();
      task.isCompleted = false;
      task.isRecurring = false;
      this.taskService.addTask(task)
        .subscribe((newTask) => {
          this.taskList.push(newTask);
          this.taskService.updateObservableState(this.taskList);
          this.clear();
        }, (err) => { console.log(err) });
    }
  }

  clear() {
    this.taskForm.reset();
  }
}
