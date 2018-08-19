import { Account } from './models/Account';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  brand = 'lean';
  isCollapsed = true;
  user: Account;

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes
   * a login button.
   */
  constructor(private authService: AuthService) {
    if (this.isCurrentUser()) {
      this.authService.getUserAccountByEmail(this.authService.getEmail())
        .subscribe(user => {
          this.user = user;
        }, err => console.log(err));
    }
  }

  /**
   * Logout
   */
  logout() {
    this.authService.logout();
    this.user = null;
  }

  /**
   * Check to see if a user is logged in
   */
  isCurrentUser() {
    const jwt = localStorage.getItem('jwt');
    return jwt != null;
  }

  onUserLoggedIn() {
    this.authService.getUserAccountByEmail(this.authService.getEmail())
      .subscribe(user => {
        this.user = user;
      }, err => console.log(err));
  }
}
