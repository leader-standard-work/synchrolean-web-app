import { AuthService } from './../../services/auth.service';
import { TeamService } from './../../services/team.service';
import { Team } from './../../models/Team';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {
  action: string;
  team: Team;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {
      this.team = new Team();
      /**
       * Attempt to grab the team id
       * from the route, if it doesn't
       * exist assign a 0
       * 
       * See app-routing for how to name
       * parameters that you can later
       * grab.
       */
      this.route.params.subscribe(p => {
        this.team.id = +p['id'] || 0;
      });
    }

  ngOnInit() {
    /**
     * Determine if we are adding a new team
     * or editing a team that already exists
     * by checking if the team object has an
     * id.
     * 
     * If we are, load the team from the
     * database and save its data into our
     * team object. This populates the form
     * with the selected teams data because
     * of our ngModel bindings.
     */
    if(this.team.id) {
      this.action = 'Edit';
      this.teamService.getTeam(this.team.id)
        .subscribe((loadedTeam: Team) => {
          this.team = loadedTeam;
        }, err => {
          console.log(err);
        });
    } 
    else {
      this.action = 'Add';
    }
  }

  /**
   * Determine which service to call based
   * on whether we are adding a new team
   * or editing an existing team.
   */
  submit() {
    if (this.team.id) {
      this.teamService.editTeam(this.team);
    }
    else {
      this.team.ownerId = this.authService.getCurrentUserId();
      this.teamService.addTeam(this.team);
    }
    this.router.navigate(['/teams/']);
  }

}
