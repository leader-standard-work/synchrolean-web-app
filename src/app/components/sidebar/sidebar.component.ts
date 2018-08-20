import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
