import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Account } from '../models/Account';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  passwordValidatorArray = [];
  nameValidatorArray = [];

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private router: Router) { 
      this.passwordValidatorArray.push(Validators.required);
      this.passwordValidatorArray.push(Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,50}"));
      this.nameValidatorArray.push(Validators.required);
      this.nameValidatorArray.push(Validators.maxLength(25));
    }

  ngOnInit() {
    this.accountForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.compose(this.nameValidatorArray)
      ]),
      lastName: new FormControl('', [
        Validators.compose(this.nameValidatorArray)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ]),
      confirmPassword: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ])
    });
  }

  addAccount() {
    let account = new Account();
    account.firstName = this.accountForm.controls['firstName'].value;
    account.lastName = this.accountForm.controls['lastName'].value;
    account.email = this.accountForm.controls['email'].value;
    console.log(account);
    this.accountService.addAccount(account);
    this.router.navigate(['/tasks']);
  }

  passwordMatch() {
    return this.accountForm.controls['password'].value == this.accountForm.controls['confirmPassword'].value;
  }
}
