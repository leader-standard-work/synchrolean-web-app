import { Team } from './../../models/Team';
import { AuthService } from './../../services/auth.service';
import { TeamService } from './../../services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';
import { Router } from '../../../../node_modules/@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[];

  constructor(
    private teamService: TeamService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    // Grab the notifications from the team service
    this.teamService.fetchTeamInvites()
      .subscribe((invites) => { 
        this.invites = invites 
      }, (err) => { console.log(err) });
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
