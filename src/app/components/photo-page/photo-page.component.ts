import { Component, Input } from '@angular/core';
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';


@Component({
  selector: 'app-photo-page',
  standalone: true,
  imports: [PhotoGalleryComponent, CommonModule, FormsModule],
  templateUrl: './photo-page.component.html',
  styleUrl: './photo-page.component.scss'
})
export class PhotoPageComponent {
  headerText: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  descriptionText: String='';
  selectedImages: File[] = []; // Ahora guardamos los archivos

constructor(private imageService: ImageService) {} // Inyectamos el servicio

uploadPhotos() {
  if (this.selectedImages.length === 0) {
    console.log("No hay imágenes para subir.");
    return;
  }

  this.imageService.login('ovfilm', 'OV01022025').subscribe({
    next: (response) => {
      console.log("Inicio de sesión exitoso:", response);
      if (response.token) {
        this.imageService.setToken(response.token);
        for (let image of this.selectedImages) {
          this.imageService.uploadFile(image).subscribe({
            next: (uploadResponse) => console.log("Imagen subida con éxito:", uploadResponse),
            error: (uploadError) => console.error("Error al subir la imagen:", uploadError)
          });
        }
      } else {
        console.error("No se recibió un token en la respuesta del login:", response);
      }
    },
    error: (error) => {
      console.error("Error al iniciar sesión:", error);
      console.error("Detalles del error:", error.error);
    }
  });
}

  onMultipleFilesSelected(event: any) {
    if (event.target.files) {
        for (let file of event.target.files) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImages.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
  }

removeImage(index: number) {
  this.selectedImages.splice(index, 1);
}

  onFileSelected(event: Event, imageType: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (imageType === 'home') {
          this.imageUrl = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  get formatteddescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }
  get formattedAboutTitle1(): string {
    return this.headerText.replace(/\n/g, '<br>');
  }
}
