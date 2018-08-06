import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as JWT from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    let token = localStorage.getItem('jwt');
    let decoded = JWT(token);
    let currentTime = Date.now() / 1000;

    console.log(currentTime < decoded.exp);

    // Should also check expiration somehow
    if (token && currentTime < decoded.exp) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
