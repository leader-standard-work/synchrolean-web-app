import { Metric } from './../../models/Metric';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { TaskService } from './../../services/task.service';
import { Task } from '../../models/Task';
import { AuthService } from '../../services/auth.service';
import { Team } from '../../models/Team';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'task-page',
  templateUrl: './task-page.component.html',
  styleUrls: ['./task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  // public pageTitle: string = this.authService.getCurrentUserName();  // Page title
  public tasks: Task[] = [];              // List of tasks from service
  private teams: Team[];
  public complete = 'Complete';
  public incomplete = 'Incomplete';
  public metrics: Metric[] = [];
  public teamMetrics: number;

  constructor(private taskService: TaskService,
    private authService: AuthService,
    private accountService: AccountService) {
    console.log('TaskPageComponent: Created');
    // Fetch the teams the user is on so they can pick which team the task belongs to
    this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
    .subscribe((teams) => {
      this.teams = teams;
    }, (err) => { console.log(err); });
  }

  /**
   * After the TaskPageComponent has been created.. right before it
   * is displayed to the end user
   */
  ngOnInit() {
    console.log('TaskPageComponent: Fetching tasks');
    this.getUserTeams();
    this.getAllTasks();
    this.getWeeklyUserMetrics();
  }

  ngOnDestroy() {

  }

  /**
   * Get all tasks for the current user
   */
  getAllTasks() {
    console.log('TaskPageComponent: Getting all tasks');
    this.taskService.getAllTasks()
      .subscribe((tasks) => {
        this.tasks = tasks;
      }, (err) => { console.log(err) });
  }

  /**
   * Get all teams for the current user
   */
  getUserTeams() {
    console.log('TaskPageComponent: Getting all teams');
    this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
      .subscribe((teams) => {
        this.teams = teams;
        // Teams need to be fetched before
        // we can fetch the team metrics
        this.getWeeklyTeamMetrics();
      }, (err) => { console.log(err); });
  }

  getFilteredTasks(teamId: number) {
    return this.tasks.filter(task => task.teamId === teamId);
  }

  /**
   * Adds a new task to the list
   * @param newTask The new task to add to the list
   */
  onTaskAdded(newTask: Task) {
    console.log('TaskPageComponent: Adding task and updating observable state');
    this.tasks.push(newTask);
    this.taskService.updateObservableState(this.tasks);
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyUserMetrics() {
    console.log('TaskPageComponent: Getting weekly user metrics');
    this.taskService.getWeeklyTaskMetrics(this.authService.getEmail())
      .subscribe((metrics) => {
        const newMetric = new Metric();
        if (!isNaN(metrics)) {
          newMetric.teamId = null;
          newMetric.teamValue = null;
          newMetric.userValue = metrics;
          this.metrics.push(newMetric);
          console.log('UserMetrics: ', metrics);
        } else {
          newMetric.teamId = null;
          newMetric.teamValue = null;
          newMetric.userValue = 0;
          this.metrics.push(newMetric);
          console.log('UserMetrics (isNaN): ', metrics);
        }
      }, (err) => {
        const newMetric = new Metric();
        newMetric.teamId = null;
        newMetric.teamValue = null;
        newMetric.userValue = 0;
        this.metrics.push(newMetric);
      });
  }

  getFilteredMetrics(teamId: number) {
    const filteredMetrics = this.metrics.find(metric => metric.teamId === teamId);
    if (filteredMetrics) {
      return filteredMetrics;
    } else {
      return new Metric();
    }
  }

  /**
   * Get the users metrics from the prior week
   */
  getWeeklyTeamMetrics() {
    console.log('TaskPageComponent: Getting weekly team metrics');
    this.teams.forEach(team => {
      this.taskService.getWeeklyTeamMetrics(team.id)
        .subscribe((fetchedTeamMetrics) => {
          this.taskService.getUserTeamMetrics(team.id, this.authService.getEmail())
            .subscribe((fetchedUserMetrics) => {
              const teamMetrics = (!isNaN(fetchedTeamMetrics)) ? fetchedTeamMetrics : 0;
              const userMetrics = (!isNaN(fetchedUserMetrics)) ? fetchedUserMetrics : 0;
              const newMetric = new Metric();
              newMetric.teamId = team.id;
              newMetric.teamValue = teamMetrics;
              newMetric.userValue = userMetrics;
              this.metrics.push(newMetric);
            }, (err) => { console.log(err); });
        }, (err) => { console.log(err); });
    });
  }
}
