import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Team } from '../models/Team';
import { AddUserRequest } from '../models/AddUserRequest';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  /**
   * Base url is provided in the environment file under src/environments/environment.ts.
   * Production version of this url should be in src/environments/environment.prod.ts.
   */
  private apiBase: string = '/team/'; // Api addition to the url (should be teams, need to update controller name)

  constructor(private http: HttpClient) { }

   /**
   * Fetches all teams.
   * @returns  A list containing all of the teams
   */
  fetchTeams() {
    const endpoint = environment.baseServerUrl + this.apiBase;
    let teams: Team[] = [];

    this.http.get<Team[]>(endpoint)
      .subscribe(data => {
        data.forEach(team => {
          teams.push(team);
        });
      }, err => {
        console.log(err);
      });
    return teams;
  }

  /**
   * Adds a single, newly created team to the database.
   * @param newTeam The team to be added to the database
   * @returns       Returns the newly created team back to the client
   */
  addTeam(newTeam: Team) {
    const endpoint = environment.baseServerUrl + this.apiBase;
    let team: Team;

    this.http.post(endpoint, newTeam)
      .subscribe((newTeam: Team) => {
        team = newTeam
      }, err => {
        console.log(err);
      });
    return team;
  }

  /**
   * Updates a team's information in the database.
   * @param updatedTeam The updated team whose changes will be saved to the database
   * @returns       Returns the newly updated team back to the client
   */
  editTeam(updatedTeam: Team) {
    const endpoint = environment.baseServerUrl + this.apiBase + updatedTeam.ownerId + '/' + updatedTeam.id;
    let team: Team;

    this.http.put(endpoint, updatedTeam)
      .subscribe((updatedTeam: Team) => {
        team = updatedTeam
      }, err => {
        console.log(err);
      });
    return team;
  }

  /**
   * Gets a team's information from the database
   * @param id The id of the team to be loaded from the database
   * @returns       Returns the selected team object
   */
  getTeam(id: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + id;

    return this.http.get(endpoint);
  }

  /**
   * Fetches all team members for the team with the specified id.
   * @param id The id of the team to fetch the members of
   * @returns       Returns a list of members belonging to the team
   */
  fetchTeamMembers(id: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'members/' + id;

    return this.http.get(endpoint);
  }

  /**
   * Invites a member to a team
   * @param inviteeId The id of the user being invited
   * @param inviterId The id of the user sending the invite
   * @param teamId The id of the team that a user is being invited to
   */
  inviteMemberToTeam(inviteeId: number, inviterId: number, teamId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/' + 
                                                 inviteeId + '/' + inviterId + '/' + teamId;
    return this.http.put(endpoint, null);
  }

  fetchTeamInvites(ownerId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/incoming/accept/' + ownerId;
    let invites: AddUserRequest[] = [];

    this.http.get<AddUserRequest[]>(endpoint)
      .subscribe(data => {
        data.forEach(invite => {
          invites.push(invite);
        });
      }, err => {
        console.log(err);
      });
    return invites;
  }

  acceptTeamInvite(inviteId: number, inviteeId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/accept/' + inviteId + '/' + inviteeId;
    
    return this.http.put(endpoint, null);
  }

  declineTeamInvite(inviteId: number, inviteeId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/reject/' + inviteId + '/' + inviteeId;

    return this.http.put(endpoint, null);
  }
}
