import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task, Frequency, Weekdays } from './../../models/Task';

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
  public weekdaysArray: string[];
  public weekdays: number; // The numerical days value for a task

  /**
   * Communicates with the task service
   */
  constructor(private taskService: TaskService, 
    private authService: AuthService) {
      this.weekdaysArray = [];
      this.weekdays = 0;
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
      recurring: new FormControl(false),
      frequency: new FormControl(Frequency.Once, [ Validators.required ])
    });
    if (this.taskId) {
      this.action = 'Edit';
      this.taskService.getTaskById(this.taskId)
        .subscribe((task) => {
          this.taskForm.setValue({
            name: task.name,
            description: task.description,
            recurring: task.isRecurring,
            frequency: task.frequency
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
      // Set task information for the task we edited
      this.setEditTask(task);
      this.taskService.editTask(task)
        .subscribe((updatedTask) => {
          this.editedTask.emit(updatedTask);
          this.clear();
        }, (err) => { console.log(err) });
    } else {
      // Set properties on the task we are creating
      this.setAddTask(task);
      this.taskService.addTask(task)
        .subscribe((newTask) => {
          this.addedTask.emit(newTask);
          this.clear();
        }, (err) => { console.log(err) });
    }
  }

  /**
   * Sets the taskForms duration property
   * @param duration The duration of the task the user is creating
   */
  setFrequency(frequency: Frequency) {
    this.taskForm.controls['frequency'].setValue(frequency);
  }

  /**
   * Returns the frequency of the task for conditionally displaying some
   * form stuffs
   * @returns The frequency of the task we are creating/editing
   */
  getFrequency() {
    return this.taskForm.controls['frequency'].value;
  }

  // /**
  //  * Probably not needed on this form
  //  * Bitshifts the weekdays number to get the days that the task occurs on
  //  * @param weekdays The number representing the days the task occurs on
  //  */
  // getWeekdays(weekdays: number) {
  //   let days = weekdays;
  //   for(let i = 0; days > 0; i++) {
  //     if (days & 1) {
  //       this.weekdaysArray.push(Weekdays[i]);
  //     }
  //     days >>= 1;
  //   }
  // }

  /**
   * Adds a day to the numerical weekdays value
   * @param dayValue The day value to add to the task
   */
  addWeekday(dayValue: number) {
    if (this.taskForm.controls['frequency'].value === 2) {
      this.weekdays += dayValue;
    }
  }

  /**
   * Sets the task information for the task we are editing
   * @param task Task to set information to
   */
  setEditTask(task: Task) {
    task.id = this.taskId;
    task.ownerId = this.authService.getCurrentUserId();
    task.name = this.taskForm.controls['name'].value;
    task.description = this.taskForm.controls['description'].value;
    task.isRecurring = this.taskForm.controls['recurring'].value; 
    task.isCompleted = false;
    task.isRemoved = false;
    task.updatedDate = new Date();
    task.frequency = this.taskForm.controls['frequency'].value;
    task.weekdays = this.weekdays;
  }

  /**
   * Sets the information for the task we are creating
   * @param task The new task we are creating
   */
  setAddTask(task: Task) {
    task.ownerId = this.authService.getCurrentUserId();
    task.name = this.taskForm.controls['name'].value;
    task.description = this.taskForm.controls['description'].value;
    task.isRecurring = this.taskForm.controls['recurring'].value;
    task.creationDate = new Date();
    task.isCompleted = false;
    task.isRemoved = false;
    task.frequency = this.taskForm.controls['frequency'].value;
    task.weekdays = this.weekdays;
  }

  /**
   * Clears the form. Used for when the close or cancel button are clicked.
   */
  clear() {
    this.taskForm.reset();
  }
}
