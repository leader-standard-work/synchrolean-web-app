import { Account } from './../../models/Account';
import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  team: Team;
  accounts: Account[];

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private authService: AuthService
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
      }, err => {
        console.log(err);
      });
    
    this.teamService.fetchTeamMembers(this.team.id)
      .subscribe((accountList: Account[]) => {
        this.accounts = accountList;
      }, err => console.log(err));
  }

  isOwnerOfTeam() {
      return this.authService.getEmail() == this.team.ownerEmail;
  }

  /**
   * Updates the displayed team information
   * after it has been edited.
   * @param updatedTeam The updated team information
   */
  onTeamUpdated(updatedTeam: Team) {
    this.team = updatedTeam;
  }

}
