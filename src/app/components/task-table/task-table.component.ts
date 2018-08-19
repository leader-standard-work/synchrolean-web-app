import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../models/Task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  @Input() tasks: Task[];
  @Input() ownerEmail: string;
  public complete = 'Complete';
  public incomplete = 'Incomplete';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}
