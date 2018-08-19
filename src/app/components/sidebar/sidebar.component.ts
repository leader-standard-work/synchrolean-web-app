<<<<<<< HEAD
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Account } from './../../models/Account';
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
>>>>>>> 7e16d066e4495d4b0226cad0ab17ea8daf4401b9

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() userLoggedIn = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  isCurrentUser() {
    const token = localStorage.getItem('jwt');
    return token != null;
  }

  onUserLoggedIn() {
    this.userLoggedIn.emit();
  }

}
