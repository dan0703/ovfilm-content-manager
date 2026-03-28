import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AboutUs } from '../models/aboutUs/aboutUs';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

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

      
    async addAboutUs(formData: FormData): Promise<any> {
      try {
        console.log('Enviando aboutUs:', formData);

        const response = await fetch(`${this.url}/admin/aboutUs`, {
          method: 'POST',
          headers: this.authHeaders(),
          body: formData,
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
      data.IMG_URL_1 = this.prependUrl(data.IMG_URL_1);
      data.IMG_URL_2 = this.prependUrl(data.IMG_URL_2);
      data.IMG_URL_3 = this.prependUrl(data.IMG_URL_3);
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