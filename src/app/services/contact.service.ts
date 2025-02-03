import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceRequest } from '../models/service-request/service-request';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  async submitRequest(serviceRequest:ServiceRequest) {
    const requestBody = {
      to: serviceRequest.email,
      clientName: `${serviceRequest.firstName} ${serviceRequest.lastName}`,
      language: 'es',
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
        return this.http.post('http://localhost:3000/send-email', requestBody).subscribe(
      (response) => {
        console.log('Correo enviado con éxito:', response);
      },
      (error) => {
        console.error('Error al enviar correo:', error);
      }
    );
  }

  constructor(private http: HttpClient) {}
}
