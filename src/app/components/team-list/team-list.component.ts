import { TeamService } from '@app/services/team.service';
import { Team } from '@app/models/Team';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AccountService } from '@app/services/account.service';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-team-list',
  templateUrl: 'team-list.component.html',
  styleUrls: ['team-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  public pageTitle = 'Teams';  // Page title
  public allTeams: Team[] = []; // List of teams from the TeamService
  public myTeams: Team[] = []; // List of teams user is on
  public myList = false;
  navigationSubscription;

  constructor(private teamService: TeamService,
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService) {
    this.navigationSubscription = this.router.events
      .subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
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
    this.teamService.getAllTeams()
      .subscribe((teams: Team[]) => {
        this.allTeams = teams;
      }, err => console.log(err));
  }

  /**
   * Filters out my teams.
   */
  getMyTeams() {
    this.accountService.getTeamsByAccountEmail(this.authService.getEmail())
      .subscribe((teams: Team[]) => {
        this.myTeams = teams;
      }, err => console.log(err));
  }

  route(teamId: number) {
    this.router.navigate([`teams/${teamId}`]);
  }

  /**
   * Updates the displayed team list after a team has
   * been added.
   * @param newTeam A newly created team to add to the
   * team list.
   */
  onTeamAdded(newTeam: Team) {
    this.allTeams.push(newTeam);
    this.myTeams.push(newTeam);
    this.teamService.updateObservableState(this.allTeams);
    this.teamService.updateObservableState(this.myTeams);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

}
