import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { ServiceRequest } from '../../models/service-request/service-request';
import { FormsModule } from '@angular/forms';
import { ContactUs } from '../../models/contactUs/contactUs';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {

  route: ActivatedRoute = inject(ActivatedRoute);
  contactService = inject(ContactService);
  serviceRequest: ServiceRequest | undefined;
  headerText: String = "";
  descriptionText: String="";
  currentLang = '';
  
  applyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(12)]),
    day: new FormControl('', [Validators.required, Validators.min(1), Validators.max(31)]),
    month: new FormControl('', [Validators.required, Validators.min(1), Validators.max(12)]),
    year: new FormControl('', [Validators.required, Validators.min(2023)]),
    doubts: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required, Validators.minLength(2)]),
    hfind: new FormControl(''),
  });
  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang');
      if (lang === 'EN' || lang === 'ES') {
        this.currentLang = lang;
        this.loadContactUs(this.currentLang); 
      }
    });
  }
  constructor() {
    this.serviceRequest 
  };
  submitAttempted = false;
  submitRequestSuccessfully = false;

  private async loadContactUs(currentLang: String) {
    try {
      const contactUs = await this.contactService.getContactUs(currentLang);
      if (contactUs) {
        this.headerText = contactUs.TITLE;
        this.descriptionText = contactUs.DESCRIPTION;
      }
    } catch (error) {
      console.error('Error al cargar About Us:', error);
    }
  }
submitApplication() {
  this.submitAttempted = true;
  if (this.applyForm.valid) {
    const serviceRequest : ServiceRequest ={
      firstName: this.applyForm.value.firstName ?? '',
      lastName: this.applyForm.value.lastName ?? '',
      email: this.applyForm.value.email ?? '',
      phone: this.applyForm.value.phone ?? '',
      day: this.applyForm.value.day ?? '',
      month: this.applyForm.value.month ?? '',
      year: this.applyForm.value.year ?? '',
      doubts: this.applyForm.value.doubts ?? '',
      location: this.applyForm.value.location ?? '',
      hfind: this.applyForm.value.hfind ?? '',
    };
    this.contactService.submitRequest(serviceRequest);
    this.applyForm.reset();
    this.submitRequestSuccessfully = true;
  }
}

  submitContactUs() {
    const contactUs: ContactUs = {
      LANGUAGE: this.currentLang,
      TITLE: this.headerText,
      DESCRIPTION: this.descriptionText,
    };
    
    this.contactService.addContactUs(contactUs).then(
      response => {
        console.log('contactUs guardado con éxito', response);
        alert('contactUs guardado correctamente');
      }
    ).catch(
      error => {
        console.error('Error al guardar ', error);
        alert('Hubo un error al guardar, Intenta mas tarde');
      }
    );
  }

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];
  years: number[] = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + i);
  get formattedDescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }
}