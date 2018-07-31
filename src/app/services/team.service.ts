import { BehaviorSubject, Observable } from 'rxjs';
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
  private apiBase: string = '/team/'; // Api addition to the url
  private teamsSubject: BehaviorSubject<Team[]>;
  private teamsObservable: Observable<Team[]>;

  constructor(private http: HttpClient) {
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
  addTeam(newTeam: Team) {
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Team>(endpoint, newTeam);
  }

  /**
   * Updates a team's information in the database.
   * @param updatedTeam The updated team whose changes will be saved to the database
   * @returns       Returns and observable of the newly updated team back to the client
   */
  editTeam(updatedTeam: Team) {
    const endpoint = environment.baseServerUrl + this.apiBase + updatedTeam.ownerId + '/' + updatedTeam.id;

    return this.http.put(endpoint, updatedTeam);
  }

  /**
   * Gets a team's information from the database
   * @param id The id of the team to be loaded from the database
   * @returns The selected team object
   */
  getTeam(id: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + id;

    return this.http.get(endpoint);
  }

  /**
   * Fetches all team members for the team with the specified id.
   * @param id The id of the team to fetch the members of
   * @returns List of members belonging to the team
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

  /**
   * Fetches all outstanding team invites awaiting a user's input.
   * @param ownerId The id of the user to fetch invites for.
   * @returns List of invites for the user
   */
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

  /**
   * Accepts an invite to a team, adding the invitee to the team.
   * @param inviteId The id of the invite being accepted
   * @param inviteeId The id of the user who is accepting the invite
   */
  acceptTeamInvite(inviteId: number, inviteeId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/accept/' + inviteId + '/' + inviteeId;
    
    return this.http.put(endpoint, null);
  }

  /**
   * Declines an invite to a team.
   * @param inviteId The id of the invite being declined
   * @param inviteeId The id of the user who is declining the invite
   */
  declineTeamInvite(inviteId: number, inviteeId: number) {
    const endpoint = environment.baseServerUrl + this.apiBase + 'invite/reject/' + inviteId + '/' + inviteeId;

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
