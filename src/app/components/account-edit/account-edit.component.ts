import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';
import { Account } from '../../models/Account';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent implements OnInit {
  @Input() account: Account;
  @Output() updatedAccount = new EventEmitter<Account>();
  public accountForm: FormGroup;
  public passwordValidatorArray = [];
  public nameValidatorArray = [];

  constructor(private authService: AuthService,
    private accountService: AccountService) {
    // Validation setup
    this.passwordValidatorArray.push(Validators.required);
    this.passwordValidatorArray.push(Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,50}'));
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
      email: new FormControl(
        {value: null, disabled: true}, 
        Validators.required
      ),
      oldPassword: new FormControl ('', [
        Validators.compose(this.passwordValidatorArray)
      ]),
      password: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ]),
      confirmPassword: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ])
    });
    this.setFormValue();
    console.log("AccountEditComponent: account = ", this.account);
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

  editAccount() {
    const editedAccount = new Account();
    editedAccount.firstName = this.accountForm.controls['firstName'].value;
    editedAccount.lastName = this.accountForm.controls['lastName'].value;
    editedAccount.email = this.account.email;
    editedAccount.password = this.accountForm.controls['password'].value;
    this.accountService.updateAccount(editedAccount)
      .subscribe((updatedAccount) => {
        this.account = updatedAccount;
        this.updatedAccount.emit(this.account);
      }), (err) => {
        console.log(err);
      }
  }

  setFormValue() {
    this.accountForm.setValue({
      firstName: this.account.firstName,
      lastName: this.account.lastName,
      email: this.account.email,
      password: this.account.password
    })
  }

}
