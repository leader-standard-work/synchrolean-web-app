import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [ Validators.required, Validators.email ]),
      password: new FormControl('', [ Validators.required ])
    });
  }

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
            this.clear();
            this.router.navigate(['/tasks']);
          }, (err) => { 
            console.log(err);
            this.clear(); 
          });
      }, (err) => {
        console.log(err);
        alert("Invalid login credentials");
        this.clear();
        this.router.navigate(['/home']);
      });
  }

  clear() {
    this.loginForm.reset();
  }
}
