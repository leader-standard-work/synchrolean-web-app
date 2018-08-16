import { Account } from './../../models/Account';
import { TeamService } from './../../services/team.service';
import { TaskService } from './../../services/task.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  public team: Team;
  public accounts: Account[];
  public isTeamMember: boolean;
  public lastWeeksMetrics: number;
  public thisWeeksMetrics: number;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private taskService: TaskService
  ) {
    this.team = new Team();
    this.route.params.subscribe(p => {
      this.team.id = p['id'];
    });
    this.getLastWeekTeamMetrics();
    this.getThisWeekTeamMetrics();
   }

  ngOnInit() {
    this.teamService.getTeam(this.team.id)
      .subscribe((loadedTeam: Team) => {
        this.team = loadedTeam;
      }, err => {
        console.log(err);
      });
    
    this.teamService.fetchTeamMembers(this.team.id)
      .subscribe((accountList: Account[]) => {
        this.accounts = accountList;
      }, err => {
        console.log(err);
      });
  }

  /**
   * Checks if the current user is the owner of the team
   */
  isOwnerOfTeam() {
      return this.authService.getEmail() == this.team.ownerEmail;
  }

  /**
   * Gets previous weeks team metrics
   */
  getLastWeekTeamMetrics() {
    this.taskService.getWeeklyTeamMetrics(this.team.id)
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.lastWeeksMetrics = metrics;
        } else {
          this.lastWeeksMetrics = 0;
        }
      }, (err) => {
        this.lastWeeksMetrics = 0; // Until the call is actually working
        console.log(err);
      });
  }

  /**
   * Gets metrics for team for previous week
   */
  getThisWeekTeamMetrics() {
    this.teamService.getTeamCompletionRate(this.team.id, this.getWeekStartDate(), this.getWeekEndDate())
      .subscribe((metrics) => {
        if (!isNaN(metrics)) {
          this.thisWeeksMetrics = metrics;
        } else {
          this.thisWeeksMetrics = 0;
        }
      }, (err) => {
        this.thisWeeksMetrics = 0; // Until the call is actually working
        console.log(err);
      });
  }

  

  /**
   * Gets the start of current week
   * @returns previous Sunday's date
   */
  getWeekStartDate(): Date {
    let today = new Date();
    let day = today.getDay();
    let startDate = new Date();
    startDate.setDate(today.getDate() - day);
    return startDate;
  }

  /**
   * Gets the end date for current week metrics
   * @returns next days date to catch all tasks for today
   */
  getWeekEndDate(): Date {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    return today;
  }
 
  /**
   * Updates the displayed team information
   * after it has been edited.
   * @param updatedTeam The updated team information
   */
  onTeamUpdated(updatedTeam: Team) {
    this.team = updatedTeam;
  }

}
