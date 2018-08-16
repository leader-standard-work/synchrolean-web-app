import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task, Weekdays } from '../../models/Task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.css']
})
export class TaskInfoComponent implements OnInit {
  public task: Task;
  public daysOfWeek: string[] = [];

  constructor(private taskService: TaskService,
    private route: ActivatedRoute) { 
      this.task = new Task();
      this.route.params.subscribe(p => {
        this.task.id = p['id'];
      });
    }

  ngOnInit() {
    this.taskService.getTaskById(this.task.id)
      .subscribe((loadedTask) => {
        this.task = loadedTask;
        this.daysOfWeek = this.getWeekdaysAsArray(this.task.weekdays);
      }, (err) => { console.log(err) });
  }

  /**
   * Handles when a task is edited
   * @param editedTask The task that was edited
   */
  onTaskEdited(editedTask) {
    this.task = editedTask;
    this.daysOfWeek = this.getWeekdaysAsArray(this.task.weekdays);
  }

  /**
   * Marks the task as completed but doesn't remove it
   */
  completeTask() {
    this.task.isCompleted = true;
    console.log('Before', this.task);
    this.taskService.editTask(this.task)
      .subscribe((completedTask) => {
        console.log('Response', completedTask);
        this.task = completedTask;
        console.log('Task is now', this.task);
      }, (err) => { console.log(err) });
  }

  /**
   * Marks the task as removed and gets rid of it from the task list
   */
  removeTask() {
    this.task.isDeleted = true;
    this.taskService.editTask(this.task)
      .subscribe((removedTask) => {
        this.task = removedTask;
      }, (err) => { console.log(err) });
  }

  /**
   * Bitshifts the weekdays number to get the days that the task occurs on
   * @returns The weekdays property as an array of strings of the days the task occurs on
   */
  getWeekdaysAsArray(weekdays: number) {
    let days: number = weekdays;
    let weekdaysArray: string[] = [];
    for(let i = 0; days > 0; i++) {
        if (days & 1) {
            weekdaysArray.push(Weekdays[i]);
        }
        days >>= 1;
    }
    return weekdaysArray;
  }
}
