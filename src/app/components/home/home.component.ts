import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReviewComponent } from "../review/review.component";
import { FormsModule } from '@angular/forms';
import { AboutUs } from '../../models/aboutUs/aboutUs';
import { HomeService } from '../../services/home.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReviewComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
onLanguageChange($event: Event) {
  const selectedLanguage = (event?.target as HTMLSelectElement).value;
  console.log('Idioma seleccionado:', selectedLanguage);
}

  headerText: String = '';
  img1: String = '';
  aboutTitle1: String = '';
  aboutText: String = ``;
  reviewsTitle: String = 'Reviews'
  img2: String = '';
  img3: String = '';
  language: String = 'ES';
  currentLang = '';

  imgFile1: File | null = null;
  imgFile2: File | null = null;
  imgFile3: File | null = null;

  constructor(private homeService: HomeService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang');
      if (lang === 'EN' || lang === 'ES') {
        this.currentLang = lang;
        this.loadAboutUs(this.currentLang);
      }
    });
  }

  aboutUs: AboutUs | undefined;

  private async loadAboutUs(currentLang: string) {
    try {
      const aboutUs = await this.homeService.getAboutUs(currentLang);
      if (aboutUs) {
        this.aboutUs = aboutUs;
        this.headerText = aboutUs.HEADER;
        this.img1 = aboutUs.IMG_URL_1 ;
        this.img2 = aboutUs.IMG_URL_2 ;
        this.img3 = aboutUs.IMG_URL_3 ;
        this.aboutTitle1 = aboutUs.TITLE;
        this.aboutText = aboutUs.DESCRIPTION;
      }
    } catch (error) {
      console.error('Error al cargar About Us:', error);
    }
  }

  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageType === 'img1') {
      this.imgFile1 = file;
      this.img1 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img2') {
      this.imgFile2 = file;
      this.img2 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img3') {
      this.imgFile3 = file;
      this.img3 = URL.createObjectURL(file) as any;
    } else {
      console.log('Imagen no encontrada');
    }
  }

  get formattedAboutText(): string {
    return this.aboutText.replace(/\n/g, '<br>');
  }

  get formattedAboutTitle1(): string {
    return this.aboutTitle1.replace(/\n/g, '<br>');
  }
  submitAboutUs() {
      const formData = new FormData();
      formData.append('LANGUAGE', this.currentLang as string);
      formData.append('HEADER', this.headerText as string);
      formData.append('TITLE', this.formattedAboutTitle1 as string);
      formData.append('DESCRIPTION', this.formattedAboutText as string);
      if (this.imgFile1) formData.append('IMG_URL_1', this.imgFile1);
      if (this.imgFile2) formData.append('IMG_URL_2', this.imgFile2);
      if (this.imgFile3) formData.append('IMG_URL_3', this.imgFile3);

      this.homeService.addAboutUs(formData).then(
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
