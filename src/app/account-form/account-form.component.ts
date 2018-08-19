import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Account } from '../models/Account';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  public action: string;
  public accountForm: FormGroup;
  private passwordValidatorArray = [];
  private nameValidatorArray = [];

  constructor(private accountService: AccountService) { 
      // Validation setup
      this.passwordValidatorArray.push(Validators.required);
      this.passwordValidatorArray.push(Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,50}'));
      this.nameValidatorArray.push(Validators.required);
      this.nameValidatorArray.push(Validators.maxLength(25));

      this.action = 'Create a new account';
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
    const account = new Account();
    account.firstName = this.accountForm.controls['firstName'].value;
    account.lastName = this.accountForm.controls['lastName'].value;
    account.email = this.accountForm.controls['email'].value;
    account.isDeleted = false;
    account.password = this.accountForm.controls['password'].value;
    this.accountService.addAccount(account)
      .subscribe((newAcc) => {
        this.clear();
      }, err => console.log(err));
  }

  // Password case validations
  passwordMatch() {
    return this.accountForm.controls['password'].value === this.accountForm.controls['confirmPassword'].value;
  }

  hasUpper() {
    const upper = (/[A-Z]/.test(this.accountForm.controls['password'].value));
    return upper;
  }

  hasLower() {
    const lower = (/[a-z]/.test(this.accountForm.controls['password'].value));
    return lower;
  }

  hasNumber() {
    const number = (/[0-9]/.test(this.accountForm.controls['password'].value));
    return number;
  }
  // End case validations

  /**
   * Clear the account form so that when the user closes the modal or
   * cancels and then re-opens the form it doesn't retain any information.
   */
  clear() {
    this.accountForm.reset();
  }
}
