import { Account } from './models/Account';
import { AuthService } from './services/auth.service';
import { Component } from '@angular/core';
import { DataSharingService } from './services/data-sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public brand: string = 'home';
  public isCollapsed: boolean = true;
  public user: Account;

  /**
   * We could use AppComponent for login logic and inject the
   * required services to handle this since the navbar includes
   * a login button.
   */
  constructor(private authService: AuthService,
    private dataSharingService: DataSharingService) {
    if (this.isCurrentUser()) {
      this.authService.getUserAccountByEmail(this.authService.getEmail())
        .subscribe(user => {
          this.user = user;
        }, err => console.log(err));
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataSharingService.isUserLoggedIn
      .subscribe(value => {
        this.user = value;
      })
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

  onUserLoggedIn(account: Account) {
    this.user = account;
    /*this.authService.getUserAccountByEmail(this.authService.getEmail())
      .subscribe(user => {
        this.user = user;
      }, err => console.log(err));
    */
  }

  getUser() {
    return this.authService.getEmail();
  }

  updateAccount(updatedAccount: Account) {
    this.user = updatedAccount;
  }
}
