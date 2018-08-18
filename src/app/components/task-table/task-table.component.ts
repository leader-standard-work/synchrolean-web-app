import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  @Input() tasks: Task[];

  constructor() { }

  ngOnInit() {
  }

}
