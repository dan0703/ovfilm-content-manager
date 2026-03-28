import { Component, Input } from '@angular/core';
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image';
import { PhotoGallery } from '../../models/photoGallery/photoGallery';
import { PhotoGalleryService } from '../../services/photoGallery.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-photo-page',
  standalone: true,
  imports: [PhotoGalleryComponent, CommonModule, FormsModule],
  templateUrl: './photo-page.component.html',
  styleUrl: './photo-page.component.scss'
})
export class PhotoPageComponent {

photoGallery: PhotoGallery | undefined;

  headerText: String = '';
  imageUrl: String = "";
  descriptionText: String='';
  selectedImages: File[] = [];
  imageList: Image[] = [];
  language: String = 'EN';
  currentLang = '';

  imgFile1: File | null = null;

constructor(private imageService: ImageService, private photoGalleryService: PhotoGalleryService, private route: ActivatedRoute, private router: Router) {
}

async ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const lang = params.get('lang');
    if (lang === 'EN' || lang === 'ES') {
      this.currentLang = lang;
      this.loadPhotoGallery(this.currentLang);
    }
  });
}

private async loadPhotoGallery(currentLang: string) {
  try {
    const photoGallery = await this.photoGalleryService.getPhotoGallery(currentLang);
    if (photoGallery) {
      this.photoGallery = photoGallery;
        this.language = photoGallery.LANGUAGE;
        this.headerText = photoGallery.TITLE;
        this.imageUrl = photoGallery.IMG_URL_1 || 'assets/home-photo.png';
        this.descriptionText = photoGallery.DESCRIPTION;
    }
  } catch (error) {
    console.error('Error al cargar photoGallery:', error);
  }
}

  async startUpload() {
    if (this.selectedImages.length === 0) {
      console.log("No hay imágenes para subir.");
      return;
    }

    console.log(this.selectedImages.length);

    try {
      await lastValueFrom(this.imageService.deleteAllImages());
      console.log("Imágenes eliminadas con éxito");

      let uploadedImages: Image[] = [];

      const uploadPromises = this.selectedImages.map(async (image) => {
        console.log(image.name);
        try {
          const uploadResponse = await lastValueFrom(this.imageService.uploadFile(image));
          console.log("Imagen subida con éxito:", uploadResponse);

          const newImage: Image = {
            IMAGE_LINK: uploadResponse.url,
            IMAGE_NAME: uploadResponse.filename,
            loaded: false
          };

          uploadedImages.push(newImage);
        } catch (uploadError) {
          console.error("Error al subir la imagen:", uploadError);
        }
      });

      await Promise.all(uploadPromises);

      console.log('Imágenes subidas:', uploadedImages);

      await this.photoGalleryService.addAllPhotos(uploadedImages);
      console.log('Fotografías guardadas con éxito');
      alert('Fotografías guardadas correctamente');

    } catch (error) {
      console.error("Error en el proceso de carga de imágenes:", error);
      alert('Hubo un error al guardar las fotografías, intenta más tarde');
    }
  }

  onMultipleFilesSelected(event: any) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
      console.log('Archivos seleccionados:', this.selectedImages);
    }
  }

removeImage(index: number) {
  this.selectedImages.splice(index, 1);
}

  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageType === 'img1') {
      this.imgFile1 = file;
      this.imageUrl = URL.createObjectURL(file) as any;
    } else {
      console.log('Imagen no encontrada');
    }
  }

  submitPhotoGallery() {
    const formData = new FormData();
    formData.append('LANGUAGE', this.currentLang as string);
    formData.append('TITLE', this.formattedHeaderText as string);
    formData.append('DESCRIPTION', this.formatteddescriptionText as string);
    if (this.imgFile1) formData.append('IMG_URL_1', this.imgFile1);

    this.photoGalleryService.addPhotogallery(formData).then(
      response => {
        console.log('photoGalleryData guardado con éxito', response);
        alert('photoGallery guardado correctamente');
      }
    ).catch(
      error => {
        console.error('Error al guardar photoGallery', error);
        alert('Hubo un error al guardar photoGallery, Intenta mas tarde');
      }
    );
  }

  get formatteddescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }
  get formattedHeaderText(): string {
    return this.headerText.replace(/\n/g, '<br>');
  }
}
