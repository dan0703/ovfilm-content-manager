import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../models/image/image';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiWebFilesUrl = 'https://garmannetworks.online';
  private apiUrl = 'http://garmannetworks.online:781';

  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiWebFilesUrl}/auth/login`,
      { username, password },
      {
        withCredentials: true 
      }
    );
  }
  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/imagelist`);
  }

  uploadFile(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);  

    console.log('🔹 Archivo añadido:', image.size);
  
    return this.http.post(`${this.apiWebFilesUrl}/files/upload`, formData, {
      withCredentials: true,  
    });
  }

  deleteAllImages(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/deleteAllImages`);
  }
}