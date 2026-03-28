import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../models/image/image';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/imagelist`);
  }

  uploadFile(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.apiUrl}/admin/image/upload`, formData);
  }

  deleteAllImages(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/AllImages`);
  }
}
