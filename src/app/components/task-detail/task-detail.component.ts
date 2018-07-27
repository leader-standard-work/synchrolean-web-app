import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../models/Task';

@Component({
  selector: 'task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
  @Input() detailedTask: Task;
  public status: string;
  public noDescription: string = 'This task has no description.';
  public recurring: string = 'This is a recurring task.';
  public nonrecurring: string = 'This is a non-recurring task.';

  constructor() { }

  ngOnInit() {
    this.status = this.detailedTask.isCompleted ? 'Completed' : 'Incomplete';
  }

  updated() {
    return this.detailedTask.updatedDate ? true : false;
  }
}
