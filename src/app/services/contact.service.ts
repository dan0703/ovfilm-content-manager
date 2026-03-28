import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceRequest } from '../models/service-request/service-request';
import { ContactUs } from '../models/contactUs/contactUs';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  async submitRequest(serviceRequest:ServiceRequest, currentLang: String) {
    const requestBody = {
      to: serviceRequest.email,
      clientName: `${serviceRequest.firstName} ${serviceRequest.lastName}`,
      language: currentLang === "ES" ? "es" : "en", 
      text: `
      Event Date: ${serviceRequest.day}/${serviceRequest.month}/${serviceRequest.year}
      Location: ${location}
      When and how did you get engaged?: ${serviceRequest.doubts}
      How you found us: ${serviceRequest.hfind}
      phone: ${serviceRequest.phone}
      email: ${serviceRequest.email}
      clientName: ${serviceRequest.firstName} ${serviceRequest.lastName}
      
      `, 
    };
        return this.http.post(`${environment.apiUrl}/send-email`, requestBody).subscribe(
      (response) => {
        console.log('Correo enviado con éxito:', response);
      },
      (error) => {
        console.error('Error al enviar correo:', error);
      }
    );
  }
  url = environment.apiUrl;

  private authHeaders(): Record<string, string> {
    const token = localStorage.getItem('ovfilm_jwt');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async addContactUs(contactUs: ContactUs): Promise<any> {
    try {
      console.log('Enviando contactUs:', contactUs);
  
      const response = await fetch(`${this.url}/admin/contactus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.authHeaders(),
        },
        body: JSON.stringify(contactUs),
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

  async getContactUs(currentLang : String): Promise<ContactUs | undefined>  {
    try {
      const response = await fetch(`${this.url}/contactus?LANGUAGE=${currentLang}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch about us: ${response.status} ${response.statusText}`);
      }
      const data: ContactUs = await response.json();
  
      return data;
    } catch (error) {
      console.error('Failed to fetch about us:', error);
      return undefined; 
    }
  }

  constructor(private http: HttpClient) {}
}
