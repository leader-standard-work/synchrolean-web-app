import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Task } from '../models/Task';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * Base url is provided in the environment file under src/environments/environment.ts.
   * Production version of this url should be in src/environments/environment.prod.ts.
   */
  private apiBase: string = '/tasks/'; // Api addition to the url
  private tasksSubject: BehaviorSubject<Task[]>;
  private tasksObservable: Observable<Task[]>;

  constructor(private http: HttpClient,
  private authService: AuthService) { 
    console.log('TaskService created.'); // For logging purposes
    this.tasksSubject = new BehaviorSubject([]);
    this.tasksObservable = this.tasksSubject.asObservable();
    if (this.authService.isCurrentUser()) {
      this.tasksObservable = this.fetchTasks(this.authService.getCurrentUserId());
    }
  }

  /**
   * Fetches all tasks corresponding to the id given as an argument.
   * @param id The id of the user to retrieve tasks for
   * @returns  A list of tasks belonging to the user matching id arg
   */
  fetchTasks(id:number): Observable<Task[]> {
    const endpoint = environment.baseServerUrl + this.apiBase + id;
    console.log('TaskService: Fetching tasks from server');
    return this.http.get<Task[]>(endpoint);
  }

  /**
   * Get tasks provides the list of tasks from the task service back to
   * the component that needs the tasks.
   * @returns List of all tasks for the current user.
   */
  getAllTasks(): Observable<Task[]> {
    console.log('TaskService: Getting all tasks');
    return this.tasksObservable;
  }

  /**
   * Get a single task by it's unique id
   * @param taskId The id of the task that we want to get
   */
  getTaskById(taskId: number): Observable<Task> {
    console.log('TaskService: Fetching task by ID');
    let ownerId = this.authService.getCurrentUserId();
    const endpoint = environment.baseServerUrl + this.apiBase + ownerId + '/' + taskId;
    return this.http.get<Task>(endpoint);
  }

  /**
   * Gets the user's task metrics for the prior week
   * @param ownerId The id of the user we are retrieving metrics for
   * @returns Observable<number> representing the user's task metrics 
   */
  getWeeklyTaskMetrics(ownerId: number): Observable<number> {
    console.log('TaskService: Fetching weekly metrics for user');
    let today = new Date();
    let day = today.getDay();
    let startDate = new Date();
    startDate.setDate(today.getDate() - (7 + day));
    let endDate = new Date();
    endDate.setDate(today.getDate() - 7);
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/user/${ownerId}/${startDate}/${endDate}`
    return this.http.get<number>(endpoint);
  }

  /**
   * Gets the user's team metrics for the prior week
   * @param teamId The id of the team we are retrieving metrics for
   * @returns Observable<number> representing the user's team metrics
   */
  getWeeklyTeamMetrics(teamId: number): Observable<number> {
    console.log('TaskService: Fetching weekly metrics for team');
    let today = new Date();
    let day = today.getDay();
    let startDate = new Date();
    startDate.setDate(today.getDate() - (7 + day));
    let endDate = new Date();
    endDate.setDate(today.getDate() - 7);
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/team/${teamId}/${startDate}/${endDate}`
    return this.http.get<number>(endpoint);
  }

  /**
   * Adds a single, newly created task to the database.
   * @param newTask The task to be added to the database
   * @returns       Returns the newly created task back to the client
   */
  addTask(newTask: Task): Observable<Task> {
    console.log('TaskService: Adding new task');
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Task>(endpoint, newTask);
  }

  /**
   * Updates a task's information in the database.
   * @param updatedTask The updated task whose changes will be saved to the database
   * @returns       Returns the newly updated task back to the client
   */
  editTask(updatedTask: Task): Observable<Task> {
    console.log('TaskService: Editing existing task');
    let id = this.authService.getCurrentUserId();
    const endpoint = environment.baseServerUrl + this.apiBase + id + '/' + updatedTask.id;
    return this.http.put<Task>(endpoint, updatedTask);
  }

  /**
   * Updates the state of the observable array of tasks
   */
  updateObservableState(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }
}
