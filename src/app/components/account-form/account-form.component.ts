import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Account } from '../../models/Account';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { DataSharingService } from '../../services/data-sharing.service';

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
  @Output() userLoggedIn = new EventEmitter<Account>();

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private dataSharingService: DataSharingService) { 
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
        this.authService.login(account.email, account.password)
          .subscribe((response) => {
            const { token } = response;
            this.authService.setSession(token);
            this.authService.getUserAccountByEmail(account.email)
              .subscribe((account) => {
                this.authService.setCurrentUser(account);
                this.authService.setEmail();
                this.clear();
                this.userLoggedIn.emit(account);
                this.dataSharingService.isUserLoggedIn.next(account);
                this.router.navigate(['/tasks']);
              }, err => {
                console.log(err);
                this.clear();
              });
          }, err => {
            console.log(err);
            alert('Invalid login credentials');
            this.clear();
            this.router.navigate(['/home']);
          });
      });
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
