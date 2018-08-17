import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/Team';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  public teams: Team[] = [];
  public permissionTeams: Team[] = [];
  @Input() public teamId: number;

  constructor(
    private teamService: TeamService,
    private authService: AuthService
  ) { }

  /**
   * Right before the view is displayed to the end user we collect
   * the teams.
   */
  ngOnInit() {
    console.log('PermissionsComponent: Fetching teams');
    // Grab the teams from the team service
    this.getAllTeams();
    this.getTeamPermissions();
  }

  /**
   * Gets all teams.
   */
  getAllTeams() {
    console.log('PermissionsComponent: Getting all teams');
    this.teamService.getAllTeams()
      .subscribe((teams: Team[]) => {
        this.teams = teams;
      }, (err) => {
        console.log(err)
      });
  }

  /**
   * Gets teams that have permissions
   */
  getTeamPermissions() {
    console.log('PermissionsComponent: Getting team permissions');
    this.teamService.getTeamPermissions(this.teamId)
      .subscribe((teams: Team[]) => {
        this.permissionTeams = teams;
      }, err => {
        console.log(err);
      });
  }

  /**
   * Determines if team has permission
   */
  isPermitted(teamId: number) {
    for (let team of this.permissionTeams) {
      if (team.id == teamId) {
        return true;
      }
    }
  }

  /**
   * Grants permission for a team to view users tasks/metrics
   * @param teamId The id of the team receiving permissions
   */
  grantTeamPermission(teamId: number) {
    console.log('PermissionsComponent: Granting permission');
    this.teamService.grantTeamPermission(this.teamId, teamId)
      .subscribe(() => {

      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Revokes permission to a team to disallow viewing users task/metrics
   * @param teamId The id of the whose permissions are being revoked
   */
  revokeTeamPermission(teamId: number) {
    console.log('PermissionsComponent: Revoking permission');
    this.teamService.revokeTeamPermission(this.teamId, teamId)
      .subscribe(() => {

      }, (err) => {
        console.log(err);
      });
  }
}
