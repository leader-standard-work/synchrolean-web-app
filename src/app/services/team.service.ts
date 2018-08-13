import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Team } from '../models/Team';
import { AddUserRequest } from '../models/AddUserRequest';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  /**
   * Base url is provided in the environment file under src/environments/environment.ts.
   * Production version of this url should be in src/environments/environment.prod.ts.
   */
  private apiBase: string = '/teams/'; // Api addition to the url
  private teamsSubject: BehaviorSubject<Team[]>;
  private teamsObservable: Observable<Team[]>;

  constructor(private http: HttpClient,
  authService: AuthService) {
    this.teamsSubject = new BehaviorSubject([]);
    this.teamsObservable = this.teamsSubject.asObservable();
    this.teamsObservable = this.fetchTeams();
  }

   /**
   * Fetches all teams.
   * @returns  Observable list of all teams.
   */
  fetchTeams(): Observable<Team[]> {
    const endpoint = environment.baseServerUrl + this.apiBase;
    console.log('TeamService: Fetching teams from server');
    return this.http.get<Team[]>(endpoint);
  }

  /**
   * Provides the observable list of teams back to
   * a calling component.
   * @returns Observable list of all teams.
   */
  getAllTeams(): Observable<Team[]> {
    console.log('TeamService: Getting all teams');
    return this.teamsObservable;
  }

  /**
   * Adds a single, newly created team to the database.
   * @param newTeam The team to be added to the database
   * @returns       Returns the newly created team back to the client
   */
  addTeam(newTeam: Team): Observable<Team> {
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Team>(endpoint, newTeam);
  }

  /**
   * Updates a team's information in the database.
   * @param updatedTeam The updated team whose changes will be saved to the database
   * @returns       Returns and observable of the newly updated team back to the client
   */
  editTeam(updatedTeam: Team): Observable<Team> {
    const endpoint = environment.baseServerUrl + this.apiBase + /*updatedTeam.ownerId +*/ '/' + updatedTeam.id;
    return this.http.put<Team>(endpoint, updatedTeam);
  }

  /**
   * Gets a team's information from the database
   * @param teamId The id of the team to be loaded from the database
   * @returns The selected team object
   */
  getTeam(teamId: number): Observable<Team> {
    const endpoint = environment.baseServerUrl + this.apiBase + teamId;
    return this.http.get<Team>(endpoint);
  }

  /**
   * Fetches all team members for the team with the specified id.
   * @param teamId The id of the team to fetch the members of
   * @returns List of members belonging to the team
   */
  fetchTeamMembers(teamId: number) {
    let members: Account[] = [];
    const endpoint = environment.baseServerUrl + this.apiBase + 'members/' + teamId;
    this.http.get<Account[]>(endpoint)
      .subscribe(data => {
        data.forEach(member => {
          members.push(member);
        });
      }, err => {
        console.log(err)
      });
    return members;
  }

  /**
   * Invites a member to a team
   * @param teamId The id of the team that a user is being invited to
   * @param email the email address of the invitee
   */
  inviteMemberToTeam(teamId: number, email: string) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/' +  '/' + teamId + '/' + email;
    return this.http.put(endpoint, null);
  }

  /**
   * Fetches all outstanding team invites awaiting a user's input.
   * @returns List of invites for the user
   */
  fetchTeamInvites() {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/incoming/accept/';
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

  /**
   * Accepts an invite to a team, adding the invitee to the team.
   * @param teamId The id of the team issuing the invite
   */
  acceptTeamInvite(teamId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/accept/' + teamId;
    return this.http.put(endpoint, null);
  }

  /**
   * Declines an invite to a team.
   * @param teamId The id of the team whose invite is being declined
   */
  declineTeamInvite(teamId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/reject/' + teamId;
    return this.http.put(endpoint, null);
  }

  /**
   * Rescinds an invite user has made
   * @param teamId The id of the team invite is for
   * @param email The email address of the user invite is for
   */
  rescindTeamInvite(teamId: number, email: string) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/rescind/' + teamId + '/' + email;
    return this.http.put(endpoint, null);
  }

  /**
   * Authorize invite to a user (team owner only)
   * @param teamId The id of the team invite is for
   * @param email The email of the user invite is for
   */
  authorizeTeamInvite(teamId: number, email: string) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/authorize/' + teamId + '/' + email;
    return this.http.put(endpoint, null);
  }

  /**
   * Veto an existing invite to a user (team owner only)
   * @param teamId The id of the team invite is for
   * @param email The email of the user invite is for
   */
  vetoTeamInvite(teamId: number, email: string) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/veto/' + teamId + '/' + email;
    return this.http.put(endpoint, null);
  }

  /**
   * Retrieves all the invites that need authorization (team owner only)
   */
  getInvitesToAuthorize() {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/incoming/authorize';
    return this.http.get(endpoint, null);
  }

  /**
   * Retrieves all invites a user has made
   */
  getCreatedInvites() {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/outgoing';
    return this.http.get(endpoint, null);
  }

  /**
   * Grant permission for subject team to view tasks/metrics to object team
   * @param objectId The id of the team granting permission
   * @param subjectId The id of the team receiving permission
   */
  grantTeamPermission(objectId: number, subjectId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'permissions/grant/' + objectId + '/' + subjectId;
    return this.http.put(endpoint, null);
  }

  /**
   * Remove permission from subject team to view object team
   * @param objectId The id of the team removing permission
   * @param subjectId The id of the team whose permissions are being revoked
   */
  revokeTeamPermission(objectId: number, subjectId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'permissions/revoke' + objectId + '/' + subjectId;
    return this.http.put(endpoint, null);
  }

  /**
   * Remove a member from a team
   * @param teamId The id of the team member is being removed from
   * @param email The email of the member being removed
   */
  removeTeamMember(teamId: number, email: string) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'remove/' + teamId + '/' + email;
    return this.http.put(endpoint, null);
  }

  /**
   * Retrieves the team rollup
   * @param teamId The id of the team being rolled up on, yo
   */
  getTeamRollUp(teamId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'rollup/' + teamId;
    return this.http.get(endpoint, null);
  }

  /**
   * Deletes the team (team owner only, may be removed)
   * @param teamId The id of the team being removed
   */
  deleteTeam(teamId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'delete/' + teamId;
    return this.http.put(endpoint, null);
  }

  /**
   * Updates the state of the observable list of teams
   * @param teams The updated list of teams
   */
  updateObservableState(teams: Team[]) {
    this.teamsSubject.next(teams);
  }
}
