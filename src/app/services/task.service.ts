import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Base url is provided in the environment file under src/environments/environment.ts.
   * Production version of this url should be in src/environments/environment.prod.ts.
   */
  private apiBase: string = '/tasks/'; // Api addition to the url
  private tasks:Task[] = [];           // Local collection of tasks

  constructor(private http: HttpClient,
  private authService: AuthService) { 
    console.log('TaskService created.'); // For logging purposes
    if (this.authService.isCurrentUser()) {
      this.fetchTasks(this.authService.getCurrentUserId());
    }
  }

  /**
   * Fetches all tasks corresponding to the id given as an argument.
   * @param id The id of the user to retrieve tasks for
   * @returns  A list of tasks belonging to the user matching id arg
   */
  fetchTasks(id:number) {
    const endpoint = environment.baseServerUrl + this.apiBase + id;
    console.log('TaskService: Fetching tasks from server');
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

  /**
   * Get tasks provides the list of tasks from the task service back to
   * the component that needs the tasks.
   * @returns List of all tasks for the current user.
   */
  getAllTasks() {
    console.log('TaskService: Getting all tasks');
    return this.tasks;
  }

  /**
   * Get completed tasks for the current user
   * @returns List of completed tasks for the current user
   */
  getCompletedTasks() {
    console.log('TaskService: Getting completed tasks');
    let completedTasks: Task[] = this.tasks.filter(task => task.isCompleted === true);
    return completedTasks;
  }

  /**
   * Get unfinished tasks for the current user
   * @returns List of unfinished tasks for the user
   */
  getUnfinishedTasks() {
    console.log('TaskService: Getting unfinished tasks');
    let unfinishedTasks: Task[] = this.tasks.filter(task => task.isCompleted === false);
    return unfinishedTasks;
  }

  /**
   * Adds a single, newly created task to the database.
   * @param newTask The task to be added to the database
   * @returns       Returns the newly created task back to the client
   */
  addTask(newTask: Task) {
    const endpoint = environment.baseServerUrl + this.apiBase;
    this.http.post(endpoint, newTask)
      .subscribe((newTask:Task) => this.tasks.push(newTask));
  }

  /**
   * Updates a task's information in the database.
   * @param updatedTask The updated task whose changes will be saved to the database
   * @returns       Returns the newly updated task back to the client
   */
  editTask(index: number, updatedTask: Task) {
    let id = this.authService.getCurrentUserId();
    const endpoint = environment.baseServerUrl + this.apiBase + id + '/' + updatedTask.id;
    this.tasks.splice(index, 1);
    this.http.put(endpoint, updatedTask)
      .subscribe((task:Task) => this.tasks.push(task));
  }
}
