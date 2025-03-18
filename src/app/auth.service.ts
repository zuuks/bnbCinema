import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; 
  private userSubject = new BehaviorSubject<boolean>(this.isAuthenticated()); 
  user$ = this.userSubject.asObservable(); // Observable za praćenje korisničkog statusa

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        localStorage.removeItem('token'); 
        this.userSubject.next(false); 
        this.router.navigate(['/login']); 
      },
      error: err => {
        console.error('Logout failed:', err);
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}