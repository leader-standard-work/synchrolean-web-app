import { Team } from '@app/models/Team';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Account } from '@app/models/Account';
import { environment } from '@base/src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiBase = '/accounts/';
  private accountsSubject: BehaviorSubject<Account[]>;
  private accountsObservable: Observable<Account[]>;

  constructor(private http: HttpClient) {
    this.accountsSubject = new BehaviorSubject([]);
    this.accountsObservable = this.accountsSubject.asObservable();
  }

  /**
   * Takes an account and sends request to server to add that account to
   * the database.
   * @param account The account to add to the database
   * @returns       The newly created account response from the server
   */
  addAccount(newAccount: Account): Observable<Account> {
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Account>(endpoint, newAccount);
  }

  /**
   * Takes an ownerId and requests a matching account for that ownerId from
   * the server.
   * @param ownerId The ownerId for the account you are looking to fetch
   * @returns       The account matching the supplied ownerId
   */
  getAccountById(ownerId: number): Observable<Account> {
    const endpoint = environment.baseServerUrl + this.apiBase + 'owner/' + ownerId;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Takes an email and requests a matching account for that email from
   * the server.
   * @param email The email for the account you are looking to fetch
   * @returns       The account matching the supplied email
   */
  getAccountByEmail(email: string): Observable<Account> {
    const endpoint = environment.baseServerUrl + this.apiBase + email;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Retrieves all accounts for users that belong to the team matching the
   * given teamId.
   * @param teamId The id of the team to retrieve accounts for
   * @returns      A list of accounts for users that belong to the given teamId
   */
  getAccountsByTeamId(teamId:number): Observable<Account[]> {
    const endpoint = environment.baseServerUrl + '/teams/members/' + teamId;
    return this.http.get<Account[]>(endpoint)
  }

  /**
   * Retrieves the teams that a user is on
   * @param email The email of the user we are retrieving teams for
   * @returns Observable array of teams the user is on
   */
  getTeamsByAccountEmail(email: string): Observable<Team[]> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}teams/${email}`;
    return this.http.get<Team[]>(endpoint);
  }

  /**
   * Update account related information corresponding to the given account ownerId.
   * @param ownerId        The ownerId for the account that needs to be updated
   * @param updatedAccount The client-side updated account object to send to the db
   * @returns              The newly updated account sent back from the server
   */
  updateAccount(updatedAccount: Account): Observable<Account> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}`;
    return this.http.put<Account>(endpoint, updatedAccount) 
  }

  /**
   * Changes the account password
   * @param oldPassword The previous account password
   * @param newPassword The new account password
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const endpoint = `${environment.baseServerUrl}${this.apiBase}password`;
    const credentials = { oldPassword, newPassword};
    return this.http.post<any>(endpoint, credentials);
  }
}
