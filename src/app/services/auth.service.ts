import { environment } from '../../environments/environment';
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
  }

  /**
   * Sets the JWT in localStorage to persist across page refreshes.
   * @param token The token to set in localStorage
   */
  setSession(token) {
    localStorage.setItem('jwt', token);
  }

  /**
   * Sets the user's email to localStorage for operations that require the
   * email and persistence across page refreshes
   */
  setEmail() {
    localStorage.setItem('email', this.currentUser.email);
  }

  /**
   * Clears all information from localStorage to essentially logout a user
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('email');
    localStorage.removeItem('jwt');
  }

  /**
   * Retrieves the current user's email address for api calls
   * @returns The current user's email address from localStorage
   */
  getEmail() {
    const email = localStorage.getItem('email');
    if (this.currentUser) {
      return this.currentUser.email;
    } else if (email) {
      return email;
    }
  }

  /**
   * Return the current user to access certain user information for api calls
   */
  getUser() {
    return this.currentUser;
  }
}
