import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhotoGallery } from '../models/photoGallery/photoGallery';
import { Image } from '../models/image/image';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoGalleryService {

    url = environment.apiUrl;

  private authHeaders(): Record<string, string> {
    const token = localStorage.getItem('ovfilm_jwt');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private prependUrl(path: any): any {
    if (path && !path.startsWith('http')) {
      return `${this.url}/${path}`;
    }
    return path;
  }
      
    async addPhotogallery(formData: FormData): Promise<any> {
      try {
        console.log('Enviando photoGallery:', formData);

        const response = await fetch(`${this.url}/admin/photoGallery`, {
          method: 'POST',
          headers: this.authHeaders(),
          body: formData,
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('photoGallery agregado con éxito:', data);
        return data; 
    
      } catch (error) {
        console.error('Error al agregar photoGallery:', error);
        throw error;
      }
    }
  
    async addAllPhotos(images: Image[]): Promise<any> {
      try {
        console.log('Enviando array de imagenes:', images);
        if(images.length === 0) {
          throw new Error('No se han seleccionado imágenes');
        }
        const response = await fetch(`${this.url}/admin/imageArray`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...this.authHeaders(),
          },
          body: JSON.stringify(images),
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('imageArray agregado con éxito:', data);
        return data; 
    
      } catch (error) {
        console.error('Error al agregar imageArray:', error);
        throw error;
      }
    }
    

  async getPhotoGallery(currentLang? : String): Promise<PhotoGallery | undefined>  {
    try {
      const response = await fetch(`${this.url}/photoGallery?LANGUAGE=${currentLang}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch photoGallery: ${response.status} ${response.statusText}`);
      }
      const data: PhotoGallery = await response.json();
      data.IMG_URL_1 = this.prependUrl(data.IMG_URL_1);
      return data;
    } catch (error) {
      console.error('Failed to fetch photoGallery:', error);
      return undefined; 
    }
  }
  

    
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
          `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }
}