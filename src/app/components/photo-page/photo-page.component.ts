import { Component, Input } from '@angular/core';
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image';
import { PhotoGallery } from '../../models/photoGallery/photoGallery';
import { PhotoGalleryService } from '../../services/photoGallery.service';
import { lastValueFrom } from 'rxjs';

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
  

constructor(private imageService: ImageService, private photoGalleryService: PhotoGalleryService) {
} 

async ngOnInit() {
  await this.logIn();
  this.loadPhotoGallery(); 

}

private async loadPhotoGallery() {
  try {
    const photoGallery = await this.photoGalleryService.getPhotoGallery();
    if (photoGallery) {
      console.log('photoGallery:', photoGallery);
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

  async onFileSelected(event: any, imageType: string) {
      if (event.target.files) {
        this.selectedImages = Array.from(event.target.files);
      }
      
      try {
        let imageUrl = await this.uploadImage();
        console.log('Imagen URL:', imageUrl);
        if(imageType === 'img1') {
          this.imageUrl = imageUrl;
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

  submitPhotoGallery() {
    const photoGalleryData: PhotoGallery = {
      LANGUAGE: "EN",
      IMG_URL_1: this.imageUrl,
      TITLE: this.formattedHeaderText,
      DESCRIPTION: this.formatteddescriptionText
    };
    
    this.photoGalleryService.addPhotogallery(photoGalleryData).then(
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
