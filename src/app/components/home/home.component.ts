import { Component } from '@angular/core';
import { ReviewComponent } from "../review/review.component";
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { lastValueFrom } from 'rxjs';
import { AboutUs } from '../../models/aboutUs/aboutUs';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReviewComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  headerText: String = '';
  img1: String = 'assets/home-photo.png';
  aboutTitle1: String = '';
  aboutText: String = ``;
  reviewsTitle: String = 'Reviews'
  img2: String = 'assets/about-us1.png';
  img3: String = 'assets/about-us2.png';
  selectedImages: File[] = []; 

  constructor(private imageService: ImageService, private homeService: HomeService) {}
  async ngOnInit() {
    await this.logIn();
    this.loadAboutUs(); 
  }
  aboutUs: AboutUs | undefined;

  private async loadAboutUs() {
    try {
      const aboutUs = await this.homeService.getAboutUs();
      if (aboutUs) {
        this.aboutUs = aboutUs;
        
        this.headerText = aboutUs.HEADER;
        this.img1 = aboutUs.IMG_URL_1 || 'assets/home-photo.png';
        this.img2 = aboutUs.IMG_URL_2 || 'assets/about-us1.png';
        this.img3 = aboutUs.IMG_URL_3 || 'assets/about-us2.png';
        this.aboutTitle1 = aboutUs.TITLE;
        this.aboutText = aboutUs.DESCRIPTION;
      }
    } catch (error) {
      console.error('Error al cargar About Us:', error);
    }
  }
  

  async logIn() {
    this.imageService.login('ovfilm@gmail.com', 'OV2025').subscribe({
      next: (response) => {
        console.log("Inicio de sesión exitoso:", response);
      },
      error: (error) => {
        console.error("Error al iniciar sesión:", error);
      }
    });
  }
  async onFileSelected(event: any, imageType: string) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
    
    try {
      let imageUrl = await this.uploadImage();
      console.log('Imagen URL:', imageUrl);
      if(imageType === 'img1') {
        this.img1 = imageUrl;
      } else if(imageType === 'img2') {
        this.img2 = imageUrl;
      } else if(imageType === 'img3') {
        this.img3 = imageUrl;
      } else {
        console.log('Imagen no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
    }
  }

  async uploadImage(): Promise<string> {
    console.log(this.selectedImages.length);
    let imageUrl: string = "";
      
    for (let image of this.selectedImages) {
      console.log(image.name);
      try {
        const uploadResponse = await lastValueFrom(this.imageService.uploadFile(image));
        console.log("Imagen subida con éxito:", uploadResponse);
        imageUrl = uploadResponse.url;
      } catch (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        break; 
      }
    }
    return imageUrl;
  }

  get formattedAboutText(): string {
    return this.aboutText.replace(/\n/g, '<br>');
  }

  get formattedAboutTitle1(): string {
    return this.aboutTitle1.replace(/\n/g, '<br>');
  }
  submitAboutUs() {
      const aboutUsData: AboutUs = {
        LANGUAGE: "EN",
        IMG_URL_1: this.img1,
        IMG_URL_2: this.img2,
        IMG_URL_3: this.img3,
        HEADER: this.headerText,
        TITLE: this.formattedAboutTitle1,
        DESCRIPTION: this.formattedAboutText
      };
      
      this.homeService.addAboutUs(aboutUsData).then(
        response => {
          console.log('About us guardado con éxito', response);
          alert('About us guardado correctamente');
        }
      ).catch(
        error => {
          console.error('Error al guardar about us', error);
          alert('Hubo un error al guardar about us, Intenta mas tarde');
        }
      );
    }
}
