import { TeamService } from './../../services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';
import { Router } from '../../../../node_modules/@angular/router';
import { Team } from '../../models/Team';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[]; // List of all invites a user has
  public pending: AddUserRequest[]; // List of invites a user has sent that are pending
  public displayPending: boolean = false;

  constructor(private teamService: TeamService,
    private router: Router) {}

  ngOnInit() {
    // Grab the notifications from the team service
    this.teamService.fetchTeamInvites()
      .subscribe((invites) => { 
        this.invites = invites;
      }, (err) => { console.log(err) });

    this.teamService.getCreatedInvites()
      .subscribe((createdInvites) => {
        this.pending = createdInvites;
      }, (err) => { console.log(err) })
  }

  /**
   * Accepts an invite to a team
   * @param invite The team invite to accept
   */
  acceptTeamInvite(invite: AddUserRequest) {
    console.log('NotificationsComponent: Accepting team invite');
    this.teamService.acceptTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }

  /**
   * Declines an invite to a team
   * @param invite The team invite to decline
   */
  declineTeamInvite(invite: AddUserRequest) {
    console.log('NotificationsComponent: Declining team invite');
    this.teamService.declineTeamInvite(invite.teamId)
      .subscribe(data => this.router.navigate(['teams/' + invite.teamId]));
  }
}
