import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required ])
    });
  }

  /**
   * Call the AuthService to go off and fetch user account by email
   */
  userLogin() {
    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;
    this.authService.login(email, password)
      .subscribe((response) => {
        const { token } = response;
        this.authService.getUserAccountByEmail(email)
          .subscribe((account) => {
            this.authService.setCurrentUser(account);
            this.authService.setSession(token, account);
            this.router.navigate(['/tasks']);
          }, (err) => { console.log(err) });
      }, (err) => {
        console.log(err);
        alert("Invalid login credentials");
        this.router.navigate(['/home']);
      });
  }

}
