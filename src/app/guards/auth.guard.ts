import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    let token = localStorage.getItem('jwt');

    // Should also check expiration somehow
    if (token) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }
}
