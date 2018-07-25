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
  navShowing: boolean = false;

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes 
   * a login button. 
   */
  constructor(private authService: AuthService) {

  }

  /**
   * Conditionally display the navigation options.
   * If there is no logged in user don't show any navigation options
   * Else show them
   */
  showNav() {
    return this.authService.isCurrentUser();
  }
}
