import { AccountService } from '@app/services/account.service';
import { TeamService } from '@app/services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '@app/models/AddUserRequest';
import { Router } from '@angular/router';
import { Account } from '@app/models/Account';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[]; // List of all invites a user has
  public pending: AddUserRequest[]; // List of invites a user has sent that are pending
  public displayPending = false;
  public inviterAccounts: Account[];
  public pendingAccounts: Account[];

  constructor(private teamService: TeamService,
    private accountService: AccountService,
    private router: Router) {
      this.teamService.fetchTeamInvites()
      .subscribe((invites) => {
        this.invites = invites;
        this.getInviterAccounts();
      }, err => console.log(err));

    this.teamService.getCreatedInvites()
      .subscribe((createdInvites) => {
        this.pending = createdInvites;
        this.getPendingAccounts();
      }, err => console.log(err));
    }

  ngOnInit() {}

  /**
   * Accepts an invite to a team
   * @param invite The team invite to accept
   */
  acceptTeamInvite(invite: AddUserRequest) {
    this.teamService.acceptTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }

  /**
   * Declines an invite to a team
   * @param invite The team invite to decline
   */
  declineTeamInvite(invite: AddUserRequest) {
    this.teamService.declineTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }

  getInviterAccounts() {
    this.inviterAccounts = [];
    this.invites.forEach(invite => {
      this.accountService.getAccountByEmail(invite.inviterEmail)
        .subscribe((account) => {
          this.inviterAccounts.push(account);
        }, err => console.log(err));
    });
  }

  getPendingAccounts() {
    this.pendingAccounts = [];
    this.pending.forEach(invite => {
      this.accountService.getAccountByEmail(invite.inviteeEmail)
        .subscribe((account) => {
          this.pendingAccounts.push(account);
        }, err => console.log(err));
    });
  }
}
