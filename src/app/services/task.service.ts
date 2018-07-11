import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task'
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService implements OnInit {
  private baseUrl: string = 'localhost:55542/';
  private apiBase: string = 'api/tasks';
  private tasks: Task[] = [];

  constructor(private http: HttpClient) { 
    console.log("TaskService created.");
  }

  ngOnInit() {
    console.log("Attempt fetching tasks...");
    let endpoint = this.baseUrl + this.apiBase;
    this.http.get<Task[]>(endpoint)
      .subscribe(data => {
        this.tasks = data;
      }, err => {
        console.log(err);
      });
  }

  getAllTasks() {
    return this.tasks;
  }
}
