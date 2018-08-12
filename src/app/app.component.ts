import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  brand: string = 'lean';
  isCollapsed: boolean = true;
  userName: string;

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes 
   * a login button. 
   */
  constructor(private authService: AuthService) {
    this.userName = this.authService.getCurrentUserName();
  }

  /**
   * Conditionally display the navigation options.
   * If there is no logged in user don't show any navigation options
   * Else show them
   */
  showNav() {
    return this.authService.isCurrentUser();
  }

  /**
   * Logout 
   */
  logout() {
    this.authService.logout();
  }

  /**
   * Check to see if a user is logged in
   */
  isCurrentUser() {
    let uid = localStorage.getItem('userId');
    return uid != null;
  }
}
