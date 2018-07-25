import { TaskService } from '../services/task.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Task } from '../models/Task';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  @Input() public taskList: Task[]; // Array of tasks to be displayed in the list (taken from TaskPageComponent)
  @Input() current: number;       // Current stores the index of the task that is currently referenced
  @Output() change: EventEmitter<number> = new EventEmitter<number>(); // Listens for changes in the chosen index

  constructor(private taskService: TaskService,
    private router: Router) { 
    console.log("TasklistComponent: Created");
  }

  /**
   * Changed location of task fetching to the task page component
   */
  ngOnInit() {
  }

  /**
   * Navigate to the add task form. This will likely change in location.
   */
  addTask() {
    this.router.navigate(['/addtask']);
  }

  // Just for testing for now
  setCurrent(index: number) {
    this.current = index;
    this.change.emit(this.current);
  }

  /**
   * Sets task isRemoved field to true, then calls server to update change
   * @param {number} index - the task list index of task
   * @param {Task} task - the task to be removed
   */
  removeTask(index: number, task: Task) {
    task.isRemoved = true;
    this.taskService.editTask(index, task);
  }
}
