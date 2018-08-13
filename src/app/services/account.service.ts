import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Account } from '../models/Account';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiBase: string = '/accounts/';
  private accountsSubject: BehaviorSubject<Account[]>;
  private accountsObservable: Observable<Account[]>;

  constructor(private http: HttpClient,
  private authService: AuthService) { 
    console.log('AccountService created.'); // For logging purposes
    this.accountsSubject = new BehaviorSubject([]);
    this.accountsObservable = this.accountsSubject.asObservable();
  }

  /**
   * Takes an account and sends request to server to add that account to
   * the database.
   * @param account The account to add to the database
   * @returns       The newly created account response from the server
   */
  addAccount(newAccount:Account): Observable<Account> {
    const endpoint = environment.baseServerUrl + this.apiBase;
    return this.http.post<Account>(endpoint, newAccount);
  }

  /**
   * Takes an ownerId and requests a matching account for that ownerId from
   * the server.
   * @param ownerId The ownerId for the account you are looking to fetch
   * @returns       The account matching the supplied ownerId 
   */
  getAccountById(ownerId:number): Observable<Account> {
    const endpoint = environment.baseServerUrl + this.apiBase + 'owner/' + ownerId;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Takes an email and requests a matching account for that email from
   * the server.
   * @param email The email for the account you are looking to fetch
   * @returns       The account matching the supplied email 
   */
  getAccountByEmail(email:string) {
    const endpoint = environment.baseServerUrl + this.apiBase + email;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Retrieves all accounts for users that belong to the team matching the
   * given teamId.
   * @param teamId The id of the team to retrieve accounts for
   * @returns      A list of accounts for users that belong to the given teamId 
   */
  getAccountsByTeamId(teamId:number) {
    const endpoint = environment.baseServerUrl + 'teams/member/' + teamId;
    let accounts:Account[];
    this.http.get<Account[]>(endpoint, { withCredentials: true })
      .subscribe((accs) => {
        accounts = accs;
      }, (err) => { 
        console.log(err) 
      });
    return accounts;
  }

  /**
   * Update account related information corresponding to the given account ownerId.
   * @param ownerId        The ownerId for the account that needs to be updated
   * @param updatedAccount The client-side updated account object to send to the db
   * @returns              The newly updated account sent back from the server
   */
  updateAccount(ownerId:number, updatedAccount:Account) {
    const endpoint = environment.baseServerUrl + this.apiBase + ownerId;
    let account:Account;
    this.http.put(endpoint, updatedAccount, { withCredentials: true })
      .subscribe((acc:Account) => {
        account = acc;
      }, (err) => { 
        console.log(err) 
      });
    return account;
  }
}
