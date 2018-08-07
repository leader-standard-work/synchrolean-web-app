import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/Account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: Account;

  constructor(private http: HttpClient) {}

  /**
   * Gets a JSON Web Token for the person logging in
   * @param email The email entered for login purposes
   * @param password The password entered for login purposes
   * @returns Observable containing the JWT for the session or error
   */
  login(email: string, password: string): Observable<any> {
    const endpoint = `${environment.baseServerUrl}/auth/login`;
    const credentials = { email, password };
    return this.http.post<any>(endpoint, credentials);
  }

  /**
   * Takes an email and returns the account associated with that email
   * @param email The email of the account we want to fetch
   * @returns The account associated with the email we are looking for
   */
  getUserAccountByEmail(email: string): Observable<Account> {
    const endpoint = `${environment.baseServerUrl}/accounts/${email}`;
    return this.http.get<Account>(endpoint);
  }

  /**
   * Sets the current user account to the given account arg
   * @param account The account that we want to set the current user to
   */
  setCurrentUser(account: Account) {
    this.currentUser = new Account();
    this.currentUser = account;
    localStorage.setItem('userId', JSON.stringify(account.ownerId));
    localStorage.setItem('userName', account.firstName);
  }

  /**
   * MAY NOT BE NECCESSARY ANY MORE
   * Sets the JWT, userId, and userName in localStorage to persist across
   * page refreshes.
   * @param token The token to set in localStorage
   * @param account The account that we want to set the id/name in localStorage
   */
  setSession(token, account: Account) {
    localStorage.setItem('userId', JSON.stringify(account.ownerId));
    localStorage.setItem('userName', account.firstName);
    localStorage.setItem('jwt', token);
  }

  /**
   * Set just the token
   */
  setToken(token) {
    localStorage.setItem('jwt', token);
  }

  /**
   * Clears all information from localStorage to essentially logout a user
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('jwt');
  }

  /**
   * Check to see if there is a current user
   * @returns true if there is a current user else false
   */
  isCurrentUser() {
    let uid = localStorage.getItem('userId');
    return (this.currentUser != null) || (uid != null);
  }

  /**
   * Get the ownerId property from the current user for fetching tasks
   * @returns The ownerId of the current user
   */
  getCurrentUserId() {
    let uid = +localStorage.getItem('userId');
    if (this.currentUser) // If a page refresh hasn't occurred
      return this.currentUser.ownerId;
    else if (uid != null) // If a page refresh has occurred
      return uid;
    else return -1; // Tough luck
  }

  /**
   * Get the name of the current user
   * @returns Current users name
   */
  getCurrentUserName() {
    let userName = localStorage.getItem('userName');
    return userName || '';
  }
}
