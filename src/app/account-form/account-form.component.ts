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
  password: string;
  confirmPassword: string;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private router: Router) { 

    }

  ngOnInit() {
    this.accountForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)
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
}
