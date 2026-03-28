import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'ovfilm_jwt';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http
      .post<{ access_token: string }>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.access_token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
