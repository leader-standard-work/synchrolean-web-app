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
    this.currentUser = new Account(); // Not sure if this is neccessary
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
        this.currentUser = userAccount;
        this.getCurrentUserInfo();
        this.router.navigate(['/tasks']);
      }, (err) => {
        alert('Your email or password is incorrect.');
        console.log(err);
      });
  }

  /**
   * Method to logout of the application
   */
  logout() {
    this.currentUser = null;
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
    return this.currentUser != null;
  }

  /**
   * Get the ownerId property from the current user for fetching tasks
   * @returns The ownerId of the current user
   */
  getCurrentUserId() {
    if (this.currentUser)
      return this.currentUser.ownerId;
    else return -1;
  }
}
