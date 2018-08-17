import { AccountService } from './../../services/account.service';
import { TeamService } from './../../services/team.service';
import { Component, OnInit } from '@angular/core';
import { AddUserRequest } from '../../models/AddUserRequest';
import { Router } from '../../../../node_modules/@angular/router';
import { Team } from '../../models/Team';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public invites: AddUserRequest[];
  public inviterTeams: Team[];
  public isTeamNames: boolean = false;

  constructor(private teamService: TeamService,
    private router: Router) {}

  ngOnInit() {
    // Grab the notifications from the team service
    this.inviterTeams = [];
    this.teamService.fetchTeamInvites()
      .subscribe((invites) => { 
        this.invites = invites;
        this.invites.forEach(invite => {
          this.teamService.getTeam(invite.teamId)
            .subscribe((team) => {
              this.inviterTeams.push(team);
              this.isTeamNames = true;
          }, (err) => { console.log(err) });
        })
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
