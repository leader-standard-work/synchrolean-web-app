import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Account } from './../../models/Account';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {    
  }

  isCurrentUser() {
    let token = localStorage.getItem('jwt');
    return token != null;
  }

}
