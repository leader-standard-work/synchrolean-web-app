import { AddUserRequest } from './../../models/AddUserRequest';
import { Account } from './../../models/Account';
import { TeamService } from './../../services/team.service';
import { TaskService } from './../../services/task.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  public team: Team;
  public accounts: Account[] = [];
  public lastWeeksMetrics: number;
  public thisWeeksMetrics: number;
  public toAuthorize: AddUserRequest[] = [];

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private taskService: TaskService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.team = new Team();
    this.route.params.subscribe(p => {
      this.team.id = p['id'];
    });
   }

  ngOnInit() {
    this.teamService.getTeam(this.team.id)
      .subscribe((loadedTeam: Team) => {
        this.team = loadedTeam;
        
        if (this.isOwnerOfTeam())
          this.getInvitesToAuthorize();
        
        this.getLastWeekTeamMetrics();
        this.getThisWeekTeamMetrics();
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
   * Verifies if current user is team owner
   */
  isOwnerOfTeam() {
    let email = this.authService.getEmail();
    return email == this.team.ownerEmail;
  }

  /**
   * Verifies if current user is team member
   */
  isMemberOfTeam() {
    let email = this.authService.getEmail();
    var teamMember: boolean;

    for (let account of this.accounts) {
      if (email == account.email)
        teamMember = true;
    }
    return teamMember;
  }

  /**
   * For conditionally displaying content on the authorizations modal
   */
  hasAuthorizations(): boolean {
    return this.toAuthorize.length > 0;
  }

  /**
   * Gets previous weeks team metrics
   */
  getLastWeekTeamMetrics() {
    console.log('TeamInfoComponent: Getting team metrics for prior week');
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
    console.log('TeamInfoComponent: Getting team metrics for current');
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
   * Deletes the current team
   */
  deleteTeam() {
    console.log("TeamInfoComponent: Deleting team");
    this.teamService.deleteTeam(this.team.id)
      .subscribe(() => {
        
      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Determines and routes to correct user page based on account email
   * @param email The email to determine which page to go to
   */
  getRoute(email: string) {
    if (email != this.authService.getEmail()) {
      this.router.navigate([`users/${email}/tasks`]);
    } else {
      this.router.navigate(['tasks']);
    }
  }
 
  /**
   * Updates the displayed team information
   * after it has been edited.
   * @param updatedTeam The updated team information
   */
  onTeamUpdated(updatedTeam: Team) {
    this.team = updatedTeam;
  }

  /**
   * Updates the account members list (DOESN'T UPDATE MEMBER LIST DISPLAYED)
   * @param updatedAccounts The updated account information
   */
  onAccountsUpdated(updatedAccounts: Account[]) {
    this.accounts = updatedAccounts;
  }

  /**
   * Removes owner from team (DOESN'T UPDATE MEMBER LIST DISPLAYED)
   * @param email The email of the member leaving the team
   */
  leaveTeam() {
    this.teamService.removeTeamMember(this.team.id, this.authService.getEmail())
      .subscribe(() => {
        this.teamService.fetchTeamMembers(this.team.id)
          .subscribe((accounts: Account[]) => {
            this.accounts = accounts;
          }, (err) => {
            console.log(err);
          })
      }, (err) => {
        console.log(err);
      })
  }

  /**
   * Rescinds a team invite to a team
   * @param invite The team invite to rescind
   */
  rescindTeamInvite(invite: AddUserRequest) {
    console.log('TeamInfoComponent: Rescinding invite');
    this.teamService.rescindTeamInvite(invite.teamId, invite.inviteeEmail)
      .subscribe((data) => {
        console.log('Invite rescinded.');
      }, (err) => { console.log(err) });
  }

  /**
   * Owner only**
   * Authorizes an invite request sent by a non-owner user of a team
   * @param invite The invite to authorize
   */
  authorizeTeamInvite(invite: AddUserRequest) {
    console.log('TeamInfoComponent: Authorizing invite');
    this.teamService.authorizeTeamInvite(invite.teamId, invite.inviteeEmail)
      .subscribe(data => { 
        console.log('Invite authorized.')
      }, (err) => { console.log(err) });
  }

  /**
   * Owner only**
   * Vetos an invite request sent by a non-owner user of a team
   * @param invite The invite to veto
   */
  vetoTeamInvite(invite: AddUserRequest) {
    console.log('TeamInfoComponent: Vetoing invite');
    this.teamService.vetoTeamInvite(invite.teamId, invite.inviteeEmail)
      .subscribe((data) => {
        console.log('Invite vetoed.')
      }, (err) => { console.log(err) })
  }

  /**
   * Owner only**
   * Retrieves all invites that a team owner has to authorize
   */
  getInvitesToAuthorize() {
    console.log('TeamInfoComponent: Getting invites to authorize');
    this.teamService.getInvitesToAuthorize()
      .subscribe((authorizations) => {
        this.toAuthorize = authorizations;
      }, (err) => { console.log(err) })
  }

}
