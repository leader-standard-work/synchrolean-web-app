import { Router } from '@angular/router';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from '../models/Account';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: Account;

  constructor(private http: HttpClient,
    private router: Router) {
    //this.currentUser = new Account(); // Not sure if this is neccessary
   }

  /**
   * Login method to handle a request to the server to login and
   * recieve a valid JWT back. For now this will simply request the
   * user account by email address.
   */
  login(email: string) {
    const endpoint = environment.baseServerUrl + '/accounts/' + email;
    this.http.get(endpoint)
      .subscribe((userAccount: Account) => {
        this.currentUser = new Account();
        this.currentUser = userAccount;
        this.setSession(this.currentUser);
        this.getCurrentUserInfo();
        this.router.navigate(['/tasks']);
      }, (err) => {
        alert('Your email or password is incorrect.');
        console.log(err);
      });
  }

  /**
   * Adds the current user's id to local storage to create a session
   * We can figure out what we want to store in localStorage as things
   * change... (JWT)
   */
  setSession(account: Account) {
    localStorage.setItem('userId', JSON.stringify(account.ownerId));
  }

  /**
   * Method to logout of the application (not called yet)
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('userId');
  }

  // Just a method for testing...
  getCurrentUserInfo() {
    console.log('OwnerId:', this.currentUser.ownerId);
    console.log('Email:', this.currentUser.email);
    console.log('Name: ' + this.currentUser.firstName + ' ' + this.currentUser.lastName);
    console.log('Account Status:', this.currentUser.isDeleted ? 'InActive' : 'Active');
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
}
