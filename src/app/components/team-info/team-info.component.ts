import { Account } from './../../models/Account';
import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.css']
})
export class TeamInfoComponent implements OnInit {
  team: Team;
  //members: Account[];
  accounts$: Observable<Account[]>;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute
  ) {
    this.team = new Team();
    //this.members = [];
    //this.accounts$ = new Observable<Account[]>();
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
    
    this.accounts$ = this.teamService.fetchTeamMembers(this.team.id);
    /*this.teamService.fetchTeamMembers(this.team.id)
      .subscribe((data: Account[]) => {
        data.forEach(member => {
          this.members.push(member);
        });
      }, err => {
        console.log(err);
      });*/
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
