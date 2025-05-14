import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Provjera autentikacije
  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } 

    // preusmjeravanje na login stranicu ako nije autentificiran
    this.router.navigate(['/login']);
    return false;
  }
} 