import { AccountService } from './../../services/account.service';
import { TeamService } from './../../services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';
import { Router } from '../../../../node_modules/@angular/router';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[];
  public inviteeAccounts: Account[] = [];
  public inviterName: string;

  constructor(
    private teamService: TeamService,
    private accountsService: AccountService,
    private router: Router) { }

  ngOnInit() {
    // Grab the notifications from the team service
    this.teamService.fetchTeamInvites()
      .subscribe((invites) => { 
        this.invites = invites;
        this.accountsService.getAccountByEmail(this.invites[0].inviterEmail)
        .subscribe((inviter) => {
          this.inviteeAccounts.push(inviter);
          this.inviterName = this.inviteeName();
        }, (err) => { console.log(err) });
      }, (err) => { console.log(err) });
  }

  /**
   * Returns the name of the person inviting the user to a team
   */
  inviteeName() {
    return `${this.inviteeAccounts[0].firstName} ${this.inviteeAccounts[0].lastName}`;
  }

  acceptTeamInvite(invite: AddUserRequest) {
    this.teamService.acceptTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }

  declineTeamInvite(invite: AddUserRequest) {
    this.teamService.declineTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }

}
