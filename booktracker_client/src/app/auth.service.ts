import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

// model korisnika
export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL za API zahtjeve
  private apiUrl = 'http://localhost:8000/api';
  // BehaviorSubject za praćenje stanja prijavljenog korisnika
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // Observable za pretplatu na promjene korisnika
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Pri inicijalizaciji provjeri postoji li spremljeni korisnik
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Registracija novog korisnika
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, email, password });
  }

  // Prijava postojećeg korisnika
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, { username, password }).pipe(
      tap((response: any) => {
        // Spremi token i korisničke podatke u localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        // Ažuriraj stanje prijavljenog korisnika
        this.currentUserSubject.next(response.user);
      })
    );
  }

  // Odjava korisnika
  logout() {
    // Ukloni podatke iz localStorage-a
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Resetiraj stanje prijavljenog korisnika
    this.currentUserSubject.next(null);
    // Preusmjeri na login stranicu
    this.router.navigate(['/login']);
  }

  // Provjera je li korisnik prijavljen
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
} 