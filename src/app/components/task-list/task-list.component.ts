import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks: Task[] = [];
  public userId: number;
  public user: Account;
  public complete: string = 'Done';
  public incomplete: string = 'In-Progress';

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private accountService: AccountService) {
    console.log('TaskListComponent: Created');
    this.route.params.subscribe(p => {
      this.userId = +p['id'];
    })
  }

  ngOnInit() {
    console.log('TaskListComponent: Fetching tasks');
    this.getAllTasks();
    this.accountService.getAccountById(this.userId)
      .subscribe((acc) => {
        this.user = acc;
      }, (err) => console.log(err));
  }

  getAllTasks() {
    console.log('TaskListComponent: Getting all tasks');
    this.taskService.fetchTasks(localStorage.getItem('email'))
      .subscribe((tasks: Task[]) => {
        this.tasks = tasks;
      }, err => console.log(err));
  }

}
