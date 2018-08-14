import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';
import { Team } from '../models/Team';
import { AddUserRequest } from '../models/AddUserRequest';
import { Account } from '../models/Account';
import { Task } from '../models/Task';

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
    console.log('TeamService: Fetching teams from server');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}`;
    return this.http.get<Team[]>(endpoint);
  }

  /**
   * Provides the observable list of teams back to
   * a calling component.
   * @returns Observable list of all teams.
   */
  getAllTeams(): Observable<Team[]> {
    return this.teamsObservable;
  }

  /**
   * Adds a single, newly created team to the database.
   * @param newTeam The team to be added to the database
   * @returns       Returns the newly created team back to the client
   */
  addTeam(newTeam: Team): Observable<Team> {
    console.log('TeamService: Adding a team');
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Team>(endpoint, newTeam);
  }

  /**
   * Updates a team's information in the database.
   * @param updatedTeam The updated team whose changes will be saved to the database
   * @returns       Returns and observable of the newly updated team back to the client
   */
  editTeam(updatedTeam: Team): Observable<Team> {
    console.log('TeamService: Editing team information');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}${updatedTeam.id}`;
    return this.http.put<Team>(endpoint, updatedTeam);
  }

  /**
   * Gets a team's information from the database
   * @param teamId The id of the team to be loaded from the database
   * @returns The selected team object
   */
  getTeam(teamId: number): Observable<Team> {
    console.log('TeamService: Fetching team information');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}${teamId}`;
    return this.http.get<Team>(endpoint);
  }

  /**
   * Fetches all team members for the team with the specified id.
   * @param teamId The id of the team to fetch the members of
   * @returns List of members belonging to the team
   */
  fetchTeamMembers(teamId: number): Observable<Account[]> {
    console.log('TeamService: Fetching team members');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}members/${teamId}`;
    return this.http.get<Account[]>(endpoint);
  }

  /**
   * Retrieves team metrics for specified time
   * @param teamId The id of the team to whose metrics are being fetched
   * @param startDate The date from which to start tracking metrics
   * @param endDate The date from which to end tracking tasks
   * @returns Obersable<number> representing the completion rate of team
   */
  getTeamCompletionRate(teamId: number, startDate: Date, endDate: Date): Observable<number> {
    console.log('TeamService: Fetching completion rate for team');
    const endpoint = `${environment.baseServerUrl}/tasks/metrics/team/${teamId}/${startDate}/${endDate}`;
    return this.http.get<number>(endpoint);
  }

  /**
   * Invites a member to a team
   * @param teamId The id of the team that a user is being invited to
   * @param email the email address of the invitee
   * @returns Observable<any>
   */
  inviteMemberToTeam(teamId: number, email: string): Observable<any> {
    console.log('TeamService: Inviting user to team');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/${teamId}/${email}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Fetches all outstanding team invites awaiting a user's input.
   * @returns Observable<AddUserRequest[]> A list of invites for the user
   */
  fetchTeamInvites(): Observable<AddUserRequest[]> {
    console.log('TeamService: Fetching all team invites');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/incoming/accept/`;
    return this.http.get<AddUserRequest[]>(endpoint);
  }

  /**
   * Accepts an invite to a team, adding the invitee to the team.
   * @param teamId The id of the team issuing the invite
   * @returns Observable<any>
   */
  acceptTeamInvite(teamId: number): Observable<any> {
    console.log('TeamService: Accepting invite to team');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/accept/${teamId}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Declines an invite to a team.
   * @param teamId The id of the team whose invite is being declined
   * @returns Observable<any>
   */
  declineTeamInvite(teamId: number): Observable<any> {
    console.log('TeamService: Declining invite to team');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/reject/${teamId}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Rescinds an invite user has made
   * @param teamId The id of the team invite is for
   * @param email The email address of the user invite is for
   * @returns Observable<any>
   */
  rescindTeamInvite(teamId: number, email: string): Observable<any> {
    console.log('TeamService: Rescinding team invite to user');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/rescind/${teamId}/${email}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Authorize invite to a user (team owner only)
   * @param teamId The id of the team invite is for
   * @param email The email of the user invite is for
   * @returns Observable<any>
   */
  authorizeTeamInvite(teamId: number, email: string): Observable<any> {
    console.log('TeamService: Authorizing a team invite');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/authorize/${teamId}/${email}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Veto an existing invite to a user (team owner only)
   * @param teamId The id of the team invite is for
   * @param email The email of the user invite is for
   * @returns Observable<any>
   */
  vetoTeamInvite(teamId: number, email: string): Observable<any> {
    console.log('TeamService: Vetoing a team invite');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/veto/${teamId}/${email}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Retrieves all the invites that need authorization (team owner only)
   * @returns Observable<AddUserRequest[]> A list of invites to authorize
   */
  getInvitesToAuthorize(): Observable<AddUserRequest[]> {
    console.log('TeamService: Fetching all invites for owner to authorize');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/incoming/authorize`;
    return this.http.get<AddUserRequest[]>(endpoint);
  }

  /**
   * Retrieves all invites a user has made
   * @returns Observable<AddUserRequest[]> A list of invites user created
   */
  getCreatedInvites(): Observable<AddUserRequest[]> {
    console.log('TeamService: Fetching user created invites');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}invite/outgoing`;
    return this.http.get<AddUserRequest[]>(endpoint);
  }

  /**
   * Grant permission for subject team to view tasks/metrics to object team
   * @param objectId The id of the team granting permission
   * @param subjectId The id of the team receiving permission
   * @returns Observable<any>
   */
  grantTeamPermission(objectId: number, subjectId: number): Observable<any> {
    console.log('TeamService: Granting permission for team visibility');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}permissions/grant/${objectId}/${subjectId}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Remove permission from subject team to view object team
   * @param objectId The id of the team removing permission
   * @param subjectId The id of the team whose permissions are being revoked
   * @returns Observable<any>
   */
  revokeTeamPermission(objectId: number, subjectId: number): Observable<any> {
    console.log('TeamService: Revoking permission for team visibility');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}permissions/revoke${objectId}/${subjectId}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Remove a member from a team
   * @param teamId The id of the team member is being removed from
   * @param email The email of the member being removed
   * @returns Observable<any>
   */
  removeTeamMember(teamId: number, email: string): Observable<any> {
    console.log('TeamService: Removing member from team');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}remove/${teamId}/${email}`;
    return this.http.put(endpoint, null);
  }

  /**
   * Retrieves the team rollup
   * @param teamId The id of the team being rolled up on, yo
   * @returns Observable<Task[]> A list of all team members tasks for the team
   */
  getTeamRollUp(teamId: number): Observable<Task[]> {
    console.log('TeamService: Fetching team roll-up');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}rollup/${teamId}`;
    return this.http.get<Task[]>(endpoint);
  }

  /**
   * Deletes the team (team owner only, may be removed)
   * @param teamId The id of the team being removed
   * @returns Observable<any>
   */
  deleteTeam(teamId: number): Observable<any> {
    console.log('TeamService: Deleting team');
    const endpoint = `${environment.baseServerUrl}${this.apiBase}delete/${teamId}`;
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
