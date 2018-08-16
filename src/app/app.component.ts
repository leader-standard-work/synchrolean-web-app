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

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes 
   * a login button. 
   */
  constructor(private authService: AuthService) {
    // this.userName = this.authService.getCurrentUserName();
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
    let jwt = localStorage.getItem('jwt');
    return jwt != null;
  }
}
