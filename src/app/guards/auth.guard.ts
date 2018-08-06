import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as JWT from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) { }

  // Route guard
  canActivate(): boolean {
    let token = localStorage.getItem('jwt');
    let decoded = <any>JWT(token);
    let currentTime = Date.now() / 1000;

    // Check to make sure the token is there and that the token hasn't expired
    if (token && currentTime < decoded.exp) {
      return true;
    }

    // If the token has expired log the user out and route them to the home page
    this.authService.logout();
    this.router.navigate(['/home']);
    return false;
  }
}
