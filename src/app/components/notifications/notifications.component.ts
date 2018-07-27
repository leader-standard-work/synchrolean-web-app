import { AuthService } from './../../services/auth.service';
import { TeamService } from './../../services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[] = []; 

  constructor(
    private teamService: TeamService,
    private authService: AuthService) { }

  ngOnInit() {
    // Grab the notifications from the team service
    this.invites = this.teamService.fetchTeamInvites(this.authService.getCurrentUserId());
  }

  acceptTeamInvite(invite: AddUserRequest) {
    this.teamService.acceptTeamInvite(invite.inviteId, invite.inviteeId)
      .subscribe();
  }

  declineTeamInvite(invite: AddUserRequest) {
    this.teamService.declineTeamInvite(invite.inviteId, invite.inviteeId)
      .subscribe();
  }

}
