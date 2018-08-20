import { WeeklyRollup } from './../../models/WeeklyRollup';
import { Team } from './../../models/Team';
import { Task } from '../../models/Task';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Account } from './../../models/Account';

@Component({
  selector: 'app-rollup',
  templateUrl: './rollup.component.html',
  styleUrls: ['./rollup.component.css']
})
export class RollupComponent implements OnInit {
  private teamId: number;
  private team: Team;
  public teamMembers: Account[];
  public rollupTasks: Task[];
  public teamCompletion: number;
  public userTasks: Task[];
  public rollup: WeeklyRollup;

  public complete: string = 'Done';
  public uncomplete: string = 'In Progress';
  public showAllTasks: boolean = true;

  constructor(private route: ActivatedRoute,
    private teamService: TeamService) {
      this.route.params
        .subscribe((p) => {
          this.teamId = +p['id'];
        }, err => console.log(err));
  }

  ngOnInit() {
    this.teamService.getTeamRollUp(this.teamId)
      .subscribe((rollup) => {
        this.rollupTasks = rollup.outstandingTasks;
        if (isNaN(rollup.completion)) {
          this.teamCompletion = 0;
        } else {
          this.teamCompletion = rollup.completion;
        }
      }, err => console.log(err));

    this.teamService.getTeam(this.teamId)
      .subscribe((team) => {
        this.team = team;
        this.teamService.fetchTeamMembers(this.team.id)
          .subscribe((members) => {
            this.teamMembers = members;
          }, (err) => { console.log(err) });
      }, (err) => { console.log(err) });
  }

  /**
   * Filters the list of tasks by the task's ownerEmail 
   * @param email The email of the person whose tasks we want to filter by
   */
  selectUserTasks(email: string) {
    this.userTasks = [];
    for (let task of this.rollupTasks) {
      if (task.ownerEmail === email)
        this.userTasks.push(task);
    }
    this.showIndividual();
  }

  /**
   * Shows all team tasks in one list when true
   */
  showAll() {
    this.showAllTasks = true;
  }

  /**
   * Flag when showing individual user's tasks
   */
  showIndividual() {
    this.showAllTasks = false;
  }

}
