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
  private apiBase = '/tasks';
  private tasksSubject: BehaviorSubject<Task[]>;
  private tasksObservable: Observable<Task[]>;

  constructor(private http: HttpClient,
  private authService: AuthService) {
    // Fetch tasks
    this.tasksSubject = new BehaviorSubject([]);
    this.tasksObservable = this.tasksSubject.asObservable();
    this.tasksObservable = this.fetchTasks(this.authService.getEmail());
  }

  /**
   * Fetches all tasks corresponding to the email given as an argument.
   * @param email The email of the user to retrieve tasks for
   * @returns  A list of tasks belonging to the user
   */
  fetchTasks(email: string): Observable<Task[]> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/${email}`;
    // const endpoint = environment.baseServerUrl + this.apiBase + '/' + email;
    return this.http.get<Task[]>(endpoint);
  }

  /**
   * Get tasks provides the list of tasks from the task service back to
   * the component that needs the tasks.
   * @returns List of all tasks for the current user.
   */
  getAllTasks(): Observable<Task[]> {
    return this.tasksObservable;
  }

  /**
   * Get a single task by it's unique id
   * @param taskId The id of the task that we want to get
   */
  getTaskById(taskId: number): Observable<Task> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/${taskId}/${this.authService.getEmail()}`;
    return this.http.get<Task>(endpoint);
  }

  /**
   * Gets the user's task metrics for the prior week
   * @param ownerId The id of the user we are retrieving metrics for
   * @returns Observable<number> representing the user's task metrics 
   */
  getWeeklyTaskMetrics(email: string) {
    const startDate: string = this.getStartDate();
    const endDate: string = this.getEndDate();
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/user/${startDate}/${endDate}/${email}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Gets the user's team metrics for the prior week
   * @param teamId The id of the team we are retrieving metrics for
   * @returns Observable<number> representing the user's team metrics
   */
  getWeeklyTeamMetrics(teamId: number): Observable<number> {
    const startDate: string = this.getStartDate();
    const endDate: string = this.getEndDate();
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/team/${teamId}/${startDate}/${endDate}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Gets total metrics for all teams user is on
   * @param email The email of the user being requested
   * @returns Observable<number> representing the user's teams metrics
   */
  getAllUserTeamsMetrics(email: string): Observable<number> {
    let startDate: string = this.getStartDate();
    let endDate: string = this.getEndDate();
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/user/teams/${startDate}/${endDate}/${email}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Gets metrics for a user's tasks assigned to a specific team
   * @param teamId The id of the team which the user's tasks are on
   * @param email The email of the user being requested
   * @returns Observable<number> representing the user's team task metrics
   */
  getUserTeamMetrics(teamId: number, email: string): Observable<number> {
    const startDate: string = this.getStartDate();
    const endDate: string = this.getEndDate();
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/user/team/${teamId}/${startDate}/${endDate}/${email}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Gets metrics for user defined date range
   * @param teamId The id of the team we are retrieving metrics for
   * @param startDate User defined metric starting date
   * @param endDate User defined metric ending date
   */
  getTeamMetricsByDateRange(teamId: number, startDate: Date, endDate: Date): Observable<number> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/metrics/team/${teamId}/${startDate}/${endDate}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Sets the start date for retrieving a user's metric information
   * @returns The start date for the user's weekly user/team metrics
   */
  getStartDate(): string {
    let today = new Date();
    let day = today.getDay();
    let startDate = new Date();
    startDate.setDate(today.getDate() - (7 + day));
    return startDate.toDateString();
  }

  /**
   * Sets the start date for retrieving a user's metric information
   * @returns The start date for the user's weekly user/team metrics
   */
  getEndDate(): string {
    let today = new Date();
    let day = today.getDay();
    let endDate = new Date();
    endDate.setDate(today.getDate() - (7 - (6 - day)));
    return endDate.toDateString();
  }

  /**
   * Adds a single, newly created task to the database.
   * @param newTask The task to be added to the database
   * @returns       Returns the newly created task back to the client
   */
  addTask(newTask: Task): Observable<Task> {
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Task>(endpoint, newTask);
  }

  /**
   * Updates a task's information in the database.
   * @param updatedTask The updated task whose changes will be saved to the database
   * @returns       Returns the newly updated task back to the client
   */
  editTask(updatedTask: Task): Observable<Task> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}/${updatedTask.id}`;
    return this.http.put<Task>(endpoint, updatedTask);
  }

  /**
   * Updates the state of the observable array of tasks so that page's can
   * update their view with new information
   */
  updateObservableState(tasks: Task[]) {
    this.tasksSubject.next(tasks);
  }
}
