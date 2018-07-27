import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/Task';

@Component({
  selector: 'tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {
  @Input() public taskList: Task[]; // Array of tasks to be displayed in the list (taken from TaskPageComponent)
  @Input() current: number;       // Current stores the index of the task that is currently referenced
  @Output() change: EventEmitter<number> = new EventEmitter<number>(); // Listens for changes in the chosen index

  constructor() { 
    console.log("TasklistComponent: Created");
  }

  /**
   * Changed location of task fetching to the task page component
   */
  ngOnInit() {
  }

  // Just for testing for now
  setCurrent(index: number) {
    this.current = index;
    this.change.emit(this.current);
  }
}
