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
  public passwordForm: FormGroup;
  public passwordValidatorArray = [];
  public nameValidatorArray = [];
  public isPasswordChange;

  constructor(private authService: AuthService,
    private accountService: AccountService) {
    // Validation setup
    this.passwordValidatorArray.push(Validators.required);
    this.passwordValidatorArray.push(Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,50}'));
    this.nameValidatorArray.push(Validators.required);
    this.nameValidatorArray.push(Validators.maxLength(25));
    this.isPasswordChange = false;
  }

  ngOnInit() {
    this.accountForm = new FormGroup({
      firstName: new FormControl(this.account.firstName, [
        Validators.compose(this.nameValidatorArray)
      ]),
      lastName: new FormControl(this.account.lastName, [
        Validators.compose(this.nameValidatorArray)
      ]),
      email: new FormControl(
        {value: this.account.email, disabled: true}, 
        Validators.required
      ),
    });
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl ('', [
        Validators.compose(this.passwordValidatorArray)
      ]),
      newPassword: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ]),
      confirmNewPassword: new FormControl('', [
        Validators.compose(this.passwordValidatorArray)
      ])
    });
  }
  
  // Password case validations
  passwordMatch() {
    return this.passwordForm.controls['newPassword'].value === this.passwordForm.controls['confirmNewPassword'].value;
  }

  hasUpper() {
    const upper = (/[A-Z]/.test(this.passwordForm.controls['newPassword'].value));
    return upper;
  }

  hasLower() {
    const lower = (/[a-z]/.test(this.passwordForm.controls['newPassword'].value));
    return lower;
  }

  hasNumber() {
    const number = (/[0-9]/.test(this.passwordForm.controls['newPassword'].value));
    return number;
  }

  passwordChange() {
    this.isPasswordChange = !this.isPasswordChange;
  }

  editAccount() {
    const editedAccount = new Account();
    editedAccount.firstName = this.accountForm.controls['firstName'].value;
    editedAccount.lastName = this.accountForm.controls['lastName'].value;
    editedAccount.email = this.account.email;
    editedAccount.isDeleted = this.account.isDeleted;
    this.accountService.updateAccount(editedAccount)
      .subscribe((updatedAccount) => {
        this.account = updatedAccount;
        if(this.isPasswordChange && this.passwordCheck) {
          var oldPassword = this.passwordForm.controls['oldPassword'].value;
          var newPassword = this.passwordForm.controls['newPassword'].value;
          this.accountService.changePassword(oldPassword, newPassword)
            .subscribe(() => {
              // Add alert box??
            }, (err) => {
              console.log(err);
            })
        }
        this.updatedAccount.emit(this.account);
      }), (err) => {
        console.log(err);
      }
  }

  populateForm() {
    this.accountForm.setValue({
      firstName: this.account.firstName,
      lastName: this.account.lastName,
      email: this.account.email
    });
  }

  passwordCheck() {
    return this.passwordForm.controls['oldPassword'].valid 
      && this.passwordForm.controls['newPassword'].valid 
      && this.passwordForm.controls['confirmNewPassword'].valid;
  }
}
