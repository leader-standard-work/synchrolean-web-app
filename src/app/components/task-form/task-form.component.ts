import { Team } from '../../models/Team';
import { AccountService } from '../../services/account.service';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task, Frequency, Weekdays, Weekday } from '../../models/Task';

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
  public weekdays: number[];
  public availableDays: Weekday[];
  public teams: Team[];
  private loadedTask: Task;

  /**
   * Communicates with the task service
   */
  constructor(private taskService: TaskService,
    private authService: AuthService,
    private accountService: AccountService) { // Will need account service to fetch team that user is on
      console.log('TaskForm: Created');
      this.weekdays = [];
      this.availableDays = Weekdays;
      // Fetch the teams the user is on so they can pick which team the task belongs to
      this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
      .subscribe((teams) => {
        this.teams = teams;
      }, (err) => { console.log(err); });
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
      completed: new FormControl(false),
      deleted: new FormControl(false),
      frequency: new FormControl(Frequency.Once, [ Validators.required ]),
      teamId: new FormControl(null)
    });
    if (this.taskId) {
      this.action = 'Edit';
      this.taskService.getTaskById(this.taskId)
        .subscribe((task) => {
          this.loadedTask = task;
          this.setFormValues();
        }, err => console.log(err));
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
    const task: Task = new Task();
    if (this.taskId) {
      // Set task information for the task we edited
      this.setEditTask(task);
      this.taskService.editTask(task)
        .subscribe((updatedTask) => {
          this.editedTask.emit(updatedTask);
          this.loadedTask = updatedTask;
          this.clear();
        }, err => console.log(err));
    } else {
      // Set properties on the task we are creating
      this.setAddTask(task);
      this.taskService.addTask(task)
        .subscribe((newTask) => {
          this.addedTask.emit(newTask);
          this.clear();
        }, err => console.log(err));
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

  /**
   * Adds a day to the numerical weekdays value
   * @param dayValue The day value to add to the task
   */
  toggleWeekday(dayValue: number) {
    const index = this.weekdays.indexOf(dayValue);
    if (index > -1) {
      this.weekdays.splice(index, 1);
    } else {
      this.weekdays.push(dayValue);
    }
  }

  weekdayIsSelected(dayValue: number) {
    return this.weekdays.includes(dayValue);
  }

  /**
   * Sets the task information for the task we are editing
   * @param task Task to set information to
   */
  setEditTask(task: Task) {
    task.id = this.taskId;
    task.name = this.taskForm.controls['name'].value;
    task.description = this.taskForm.controls['description'].value;
    task.isRecurring = this.taskForm.controls['recurring'].value;
    task.isCompleted = this.taskForm.controls['completed'].value;
    task.isDeleted = this.taskForm.controls['deleted'].value;
    task.frequency = this.taskForm.controls['frequency'].value;
    task.ownerEmail = this.authService.getEmail();
    task.teamId = this.taskForm.controls['teamId'].value;
    if (task.frequency === 1) {
      // Sum the values in the weekdays array
      task.weekdays = this.weekdays.reduce((a, b) => a + b, 0);
    } else {
      task.weekdays = 0;
    }
  }

  /**
   * Sets the information for the task we are creating
   * @param task The new task we are creating
   */
  setAddTask(task: Task) {
    task.ownerEmail = this.authService.getEmail();
    task.name = this.taskForm.controls['name'].value;
    task.description = this.taskForm.controls['description'].value;
    task.isRecurring = this.taskForm.controls['recurring'].value;
    task.creationDate = new Date();
    task.isCompleted = false;
    task.isDeleted = false;
    task.frequency = this.taskForm.controls['frequency'].value;
    task.teamId = this.taskForm.controls['teamId'].value;
    if (task.frequency === 1) {
      // Sum the values in the weekdays array
      task.weekdays = this.weekdays.reduce((a, b) => a + b, 0);
    } else {
      task.weekdays = 0;
    }
  }

  /**
   * Sets the tasks teamId to the team the user selects
   * @param id The teamId for the team the task belongs to
   */
  setTaskTeamId(id: number) {
    this.taskForm.controls['teamId'].setValue(id);
  }

  /**
   * Clears the form. Used for when the close or cancel button are clicked.
   */
  clear() {
    if (!this.taskId) {
      this.taskForm.reset();
      this.taskForm.controls['recurring'].setValue(false);
      this.weekdays = [];
    } else {
      this.setFormValues();
    }
  }

  setFormValues() {
    this.taskForm.setValue({
      name: this.loadedTask.name,
      description: this.loadedTask.description,
      recurring: this.loadedTask.isRecurring,
      completed: this.loadedTask.isCompleted,
      deleted: this.loadedTask.isDeleted,
      frequency: this.loadedTask.frequency,
      teamId: this.loadedTask.teamId
    });
    this.weekdays = this.getWeekdaysAsArray(this.loadedTask.weekdays);
  }

  /**
   * Bitshifts the weekdays number to get the days that the task occurs on
   * @returns The weekdays property as an array of strings of the days the task occurs on
   */
  getWeekdaysAsArray(weekdays: number) {
    let days: number = weekdays;
    const weekdaysArray: number[] = [];
    for (let i = 0; days > 0; i++) {
        if (days & 1) {
          weekdaysArray.push(Weekdays[i].value);
        }
        days >>= 1;
    }
    return weekdaysArray;
  }
}
