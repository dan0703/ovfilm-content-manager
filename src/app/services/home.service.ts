import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
import { AboutUs } from '../models/aboutUs/aboutUs';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
    // url = 'http://localhost:1624';
    url = 'http://garmannetworks.online:781';
      
    async addAboutUs(aboutUs: AboutUs): Promise<any> {
      try {
        console.log('Enviando aboutUs:', aboutUs);
    
        const response = await fetch(`${this.url}/admin/aboutUs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(aboutUs),
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('AboutUs agregado con éxito:', data);
        return data; 
    
      } catch (error) {
        console.error('Error al agregar AboutUs:', error);
        throw error;
      }
    }
    

  async getAboutUs(currentLang: String): Promise<AboutUs | undefined>  {
    try {
      const response = await fetch(`${this.url}/aboutUs?LANGUAGE=${currentLang}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch about us: ${response.status} ${response.statusText}`);
      }
      const data: AboutUs = await response.json();
      console.log('About us fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch about us:', error);
      return undefined; 
    }
  }
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
          `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }
}