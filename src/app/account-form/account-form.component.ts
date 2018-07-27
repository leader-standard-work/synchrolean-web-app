import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm:FormGroup;

  constructor(private accountService: AccountService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder) { 

    }

  ngOnInit() {
    this.accountForm = this.formBuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(50)
      ]],
      password1: ['', [
        Validators.required
      ]],
      password2: ['', [
        Validators.required
      ]]
    });
  }

  addAccount() {

  }
}
