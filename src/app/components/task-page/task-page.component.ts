import { TeamService } from '@app/services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Metric } from '@app/models/Metric';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { TaskService } from '@app/services/task.service';
import { Task } from '@app/models/Task';
import { AuthService } from '@app/services/auth.service';
import { Team } from '@app/models/Team';
import { AccountService } from '@app/services/account.service';
import { Permission } from '@app/models/Permission';

@Component({
  selector: 'task-page',
  templateUrl: 'task-page.component.html',
  styleUrls: ['task-page.component.css']
})
export class TaskPageComponent implements OnInit, OnDestroy {
  // public pageTitle: string = this.authService.getCurrentUserName();  // Page title
  public tasks: Task[] = [];              // List of tasks from service
  public teams: Team[] = [];
  private permissions: Permission[] = [];
  public viewerIsOwner: boolean;
  public ownerEmail: string;
  public metrics: Metric[] = [];
  public teamMetrics: number;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private accountService: AccountService,
    private teamService: TeamService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(p => {
      if (p['email']) {
        this.ownerEmail = p['email'] || null;
        this.viewerIsOwner = false;
      } else {
        this.ownerEmail = this.authService.getEmail();
        this.viewerIsOwner = true;
      }
    });
    // Fetch the teams the user is on so they can pick which team the task belongs to
    this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
    .subscribe((teams) => {
      this.teams = teams;
    }, err => console.log(err));
  }

  /**
   * After the TaskPageComponent has been created.. right before it
   * is displayed to the end user
   */
  ngOnInit() {
    this.getUserTeams();
    this.getAllTasks();
  }

  ngOnDestroy() {

  }

  /**
   * Get all tasks for the current user
   */
  getAllTasks() {
    if (this.viewerIsOwner) {
      this.taskService.getAllTasks()
      .subscribe((tasks) => {
        this.tasks = tasks;
      }, err => console.log(err));
    } else {
      this.taskService.fetchTasks(this.ownerEmail)
        .subscribe((tasks: Task[]) => {
          this.tasks = tasks;
        }, err => console.log(err));
    }
  }

  /**
   * Get all teams for the current user
   */
  getUserTeams() {
    this.accountService.getTeamsByAccountEmail(this.ownerEmail)
      .subscribe((teams) => {
        this.teams = teams;
        if (!this.viewerIsOwner) {
          // If the user is viewing another member's page
          // determine the permissions they have for the
          // member's teams.
          this.teams.forEach(team => {
            this.teamService.userIsPermittedToSeeTeam(team.id)
              .subscribe((isPermitted) => {
                const newPermission = new Permission();
                newPermission.teamId = team.id;
                newPermission.isPermitted = isPermitted;
                this.permissions.push(newPermission);
              }, err => console.log(err));
          });
        }
      }, err => console.log(err));
  }

  userIsPermittedToSeeTeam(teamId: number) {
    if (this.viewerIsOwner) {
      return true;
    }
    const teamPermission = this.permissions.find(permission => permission.teamId === teamId);
    if (teamPermission) {
      return teamPermission.isPermitted;
    }
  }

  getFilteredTasks(teamId: number) {
    return this.tasks.filter(task => task.teamId === teamId);
  }

  /**
   * Adds a new task to the list
   * @param newTask The new task to add to the list
   */
  onTaskAdded(newTask: Task) {
    this.tasks.push(newTask);
    this.taskService.updateObservableState(this.tasks);
  }

  normalizeTeamName(teamName: string) {
    return teamName.replace(/ /g, '');
  }
}
