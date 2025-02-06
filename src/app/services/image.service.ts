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
    return this.http.post<any>(
      `${this.url}/auth/login`,
      { username, password },
      {
        withCredentials: true 
      }
    );
  }

  uploadFile(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
  
    // 🔹 Obtener la cookie guardada
    const sessionCookie = localStorage.getItem("sessionCookie");
  
    return this.http.post(`${this.url}/files/upload`, formData, {
      headers: new HttpHeaders({
        'Cookie': sessionCookie || '' // 🔹 Enviar la cookie manualmente
      }),
      withCredentials: true // 🔹 Asegurar que se envíe si el servidor lo permite
    });
  }
  

}
