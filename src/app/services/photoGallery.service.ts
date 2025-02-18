import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
import { AboutUs } from '../models/aboutUs/aboutUs';
import { PhotoGallery } from '../models/photoGallery/photoGallery';
import { Image } from '../models/image/image'; // Adjust the import path as necessary
@Injectable({
  providedIn: 'root'
})
export class PhotoGalleryService {
  
    // url = 'http://localhost:1624';
    url = 'http://garmannetworks.online:781';
      
    async addPhotogallery(photoGallery: PhotoGallery): Promise<any> {
      try {
        console.log('Enviando photoGallery:', photoGallery);
    
        const response = await fetch(`${this.url}/admin/photoGallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(photoGallery),
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