import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() userLoggedIn = new EventEmitter();

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
  }

  isCurrentUser() {
    const token = localStorage.getItem('jwt');
    return token != null;
  }

  onUserLoggedIn() {
    this.userLoggedIn.emit();
  }
  /*
  userLogin({email, password}) {
    //const email = this.loginForm.controls['email'].value;
      //const password = this.loginForm.controls['password'].value;
      this.authService.login(email, password)
      .subscribe((response) => {
        const { token } = response;
        this.authService.setSession(token);
        this.authService.getUserAccountByEmail(email)
          .subscribe((account) => {
            this.authService.setCurrentUser(account);
            this.authService.setEmail();
            //this.clear();
            this.userLoggedIn.emit();
            this.router.navigate(['/tasks']);
          }, err => {
            console.log(err);
            //this.clear();
          });
      }, err => {
        console.log(err);
        alert('Invalid login credentials');
        //this.clear();
        this.router.navigate(['/home']);
      });
  }
  */

}
