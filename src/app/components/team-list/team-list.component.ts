import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '../../../../node_modules/@angular/router';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  public pageTitle: string = 'Teams';  // Page title
  public allTeams: Team[] = []; // List of teams from the TeamService
  public myTeams: Team[] = []; // List of teams user is on
  public myList = false;
  navigationSubscription;

  constructor(private teamService: TeamService,
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService) {
    console.log('TeamListComponent: Created');
    this.navigationSubscription = this.router.events
      .subscribe((e: any) => {
        if(e instanceof NavigationEnd) {
          console.log("TeamListComponent: Updating teams list");
          this.teamService.updateObservableState(this.allTeams);
          this.teamService.updateObservableState(this.myTeams);
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
    this.getMyTeams();
    this.teamService.updateObservableState(this.allTeams);
    this.teamService.updateObservableState(this.myTeams);
  }

  /**
   * Gets all teams.
   */
  getAllTeams() {
    console.log('TeamListComponent: Getting all teams');
    this.teamService.getAllTeams()
      .subscribe((teams: Team[]) => {
        this.allTeams = teams;
      }, (err) => {
        console.log(err)
      });
  }

  /**
   * Filters out my teams.
   */
  getMyTeams() {
    console.log('TeamListComponent: Filtering out my teams');
    this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
      .subscribe((teams: Team[]) => {
        this.myTeams = teams;
      }, (err) => {
        console.log(err);
      })
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
    this.allTeams.push(newTeam);
    this.myTeams.push(newTeam);
    this.teamService.updateObservableState(this.allTeams);
    this.teamService.updateObservableState(this.myTeams);
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
