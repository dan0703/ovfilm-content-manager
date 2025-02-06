import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private url = 'https://danjoshua.xyz';
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

    console.log('🔹 Archivo añadido:', image.size);
  
    return this.http.post(`${this.url}/files/upload`, formData, {
      withCredentials: true,  
    });
  }
}
