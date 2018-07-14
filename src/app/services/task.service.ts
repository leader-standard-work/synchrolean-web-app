import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Base url is provided in the environment file under src/environments/environment.ts.
   * Production version of this url should be in src/environments/environment.prod.ts.
   */
  private apiBase: string = '/tasks/'; // Api addition to the url

  constructor(private http: HttpClient) { 
    console.log("TaskService created."); // For logging purposes
  }

  /**
   * Fetches all tasks corresponding to the id given as an argument.
   * @param id The id of the user to retrieve tasks for
   * @returns  A list of tasks belonging to the user matching id arg
   */
  fetchTasks(id:number) {
    const endpoint = environment.baseServerUrl + this.apiBase + id;

    console.log('TaskService: Fetching tasks for ownerId ' + id);
    let userTasks: Task[] = [];
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
          userTasks.push(newTask);
        })
      }, err => {
        console.log(err);
      });
    return userTasks;
  }

  /**
   * Adds a single, newly created task to the database.
   * @param newTask The task to be added to the database
   * @returns       Returns the newly created task back to the client
   */
  addTask(newTask: Task) {
    const endpoint = environment.baseServerUrl + this.apiBase;
    let task:Task;
    this.http.post(endpoint, newTask, { withCredentials: true })
      .subscribe((newTask:Task) => task = newTask);
    return task;
  }
}
