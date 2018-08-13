import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// Leaving this import here for if we decide to use an expiration time
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

    // Check to make sure the token is there
    if (token) {
      return true;
    }

    // If the token isn't there log the user out
    this.authService.logout();
    this.router.navigate(['/home']);
    return false;
  }
}
