import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  // Array of teans to be displayed in the list
  public teams: Team[] = [];

  constructor(private teamService: TeamService) { }

  /**
   * Right before the view is displayed to the end user we collect
   * the teams.
   */
  ngOnInit() {
    // Grab the tasks from the task service
    this.teams = this.teamService.fetchTeams();
    console.log(this.teams);
  }

}
