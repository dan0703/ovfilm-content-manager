import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url = 'http://garmannetworks.online:780';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/auth/login`, { username, password }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
    });
  }
  

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  uploadFile(file: File): Observable<any> {
    if (!this.getToken()) {
      throw new Error('User is not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`
    });

    return this.http.post<any>(`${this.url}/files/upload`, formData, { headers });
  }
}
