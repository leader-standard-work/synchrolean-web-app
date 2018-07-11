import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // We will want to move the base url somewhere useful
  private baseUrl: string = 'http://localhost:55542/';
  private apiBase: string = 'api/tasks/5'; // This is only for test purposes
  private tasks: Task[] = [];

  constructor(private http: HttpClient) { 
    console.log("TaskService created.");
    this.fetchTasks(); // Fetch tasks from the server
  }

  /**
   * We will want to rework this to fetch tasks of the currently
   * logged in user. For now it is set like this because, in the
   * endpoint string I include the id of a user (myself) for test
   * purposes.
   */
  fetchTasks() {
    console.log("Attempt fetching tasks from server...");
    let endpoint = this.baseUrl + this.apiBase;
    this.http.get<Task[]>(endpoint, { withCredentials: true })
      .subscribe(data => {
        // We will also want to make sure we grab data appropriately
        data.forEach(task => {
          let newTask = new Task();
          newTask.id = task.id;
          newTask.ownerId = task.ownerId;
          newTask.name = task.name;
          newTask.description = task.description;
          newTask.isCompleted = task.isCompleted;
          newTask.isRecurring = task.isRecurring;
          newTask.isRemoved = task.isRemoved;
          newTask.completionDate = task.completionDate;
          newTask.creationDate = task.creationDate;
          this.tasks.push(newTask);
        })
      }, err => {
        console.log(err);
      });
  }

  // Returns the array of tasks to caller
  getTasks() {
    return this.tasks;
  }
}
