import { Component, Input } from '@angular/core';
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image';

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
  selectedImages: File[] = []; 
  imageList: Image[] = [];
  

constructor(private imageService: ImageService) {
} 

async ngOnInit() {
  await this.logIn();
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

  startUpload() {
    if (this.selectedImages.length === 0) {
      console.log("No hay imágenes para subir.");
      return;
    }
    console.log(this.selectedImages.length);
    this.imageService.deleteAllImages().subscribe({
      next: (deleteResponse) => {
        console.log("Imágenes eliminadas con éxito:", deleteResponse);
      },
      error: (deleteError) => console.error("Error al eliminar las imágenes:", deleteError)
    });

    for (let image of this.selectedImages) {
      console.log(image.name);
      this.imageService.uploadFile(image).subscribe({
        next: (uploadResponse) => {
          console.log("Imagen subida con éxito:", uploadResponse);          
          const newImage: Image = {
            IMAGE_LINK: uploadResponse.url,
            IMAGE_NAME: uploadResponse.name ,
            loaded: false
          };

          this.imageList.push(newImage); 
        },
        error: (uploadError) => console.error("Error al subir la imagen:", uploadError)
      });
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
