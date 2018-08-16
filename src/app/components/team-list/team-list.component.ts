import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  public pageTitle: string = 'Teams';  // Page title
  public teams: Team[] = []; // List of teams from the TeamService
  navigationSubscription;

  constructor(private teamService: TeamService,
    private router: Router) {
    console.log('TeamListComponent: Created');
    this.navigationSubscription = this.router.events
      .subscribe((e: any) => {
        if(e instanceof NavigationEnd) {
          console.log("TeamListComponent: Updating teams list");
          this.teamService.updateObservableState(this.teams);
          this.getAllTeams();
        }
      });
  }

  /**
   * Right before the view is displayed to the end user we collect
   * the teams.
   */
  ngOnInit() {
    console.log('TeamListComponent: Fetching teams');
    // Grab the teams from the team service
    this.getAllTeams();
    this.teamService.updateObservableState(this.teams);
  }

  /**
   * Gets all teams.
   */
  getAllTeams() {
    console.log('TeamListComponent: Getting all teams');
    this.teamService.getAllTeams()
      .subscribe((teams: Team[]) => {
        this.teams = teams;
      }, err => console.log(err));
  }

  /**
   * Updates the displayed team list after a team has
   * been added.
   * @param newTeam A newly created team to add to the
   * team list.
   */
  onTeamAdded(newTeam: Team) {
    console.log("Added new team")
    console.log(newTeam);
    this.teams.push(newTeam);
    this.teamService.updateObservableState(this.teams);
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log("TeamListComponent: Destroyed");
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
