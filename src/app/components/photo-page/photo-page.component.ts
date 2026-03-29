import { Component, Input, OnDestroy } from '@angular/core';
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image';
import { PhotoGallery } from '../../models/photoGallery/photoGallery';
import { PhotoGalleryService } from '../../services/photoGallery.service';
import { lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-photo-page',
  standalone: true,
  imports: [PhotoGalleryComponent, CommonModule, FormsModule],
  templateUrl: './photo-page.component.html',
  styleUrl: './photo-page.component.scss'
})
export class PhotoPageComponent implements OnDestroy {

  photoGallery: PhotoGallery | undefined;
  headerText: String = '';
  imageUrl: String = '';
  descriptionText: String = '';
  selectedImages: File[] = [];
  existingImages: Image[] = [];
  @Input() imageList: Image[] = [];
  language: String = 'EN';
  currentLang = '';
  imgFile1: File | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadTotal: number = 0;
  private routeSub?: Subscription;

  constructor(
    private imageService: ImageService,
    private photoGalleryService: PhotoGalleryService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadExistingImages();
    this.routeSub = this.route.paramMap.subscribe(params => {
      const lang = params.get('lang');
      if (lang === 'EN' || lang === 'ES') {
        this.currentLang = lang;
        this.loadPhotoGallery(this.currentLang);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
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

  loadExistingImages() {
    this.imageService.getImages().subscribe({
      next: (data: Image[]) => {
        this.existingImages = data;
      },
      error: (error) => {
        console.error('Error loading existing images:', error);
      }
    });
  }

  async deleteImage(imageName: string) {
    if (!confirm('¿Eliminar esta imagen?')) return;
    try {
      await lastValueFrom(this.imageService.deleteImage(imageName));
      this.existingImages = this.existingImages.filter(img => img.IMAGE_NAME !== imageName);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Error al eliminar la imagen');
    }
  }

  async deleteAllImages() {
    if (!confirm('¿Eliminar TODAS las imágenes de la galería?')) return;
    try {
      await lastValueFrom(this.imageService.deleteAllImages());
      this.existingImages = [];
      alert('Galería vaciada correctamente');
    } catch (error) {
      console.error('Error al eliminar imágenes:', error);
      alert('Error al vaciar la galería');
    }
  }

  async startUpload() {
    if (this.selectedImages.length === 0) {
      alert('No hay imágenes seleccionadas');
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;
    this.uploadTotal = this.selectedImages.length;

    try {
      for (const image of this.selectedImages) {
        await lastValueFrom(this.imageService.uploadFile(image));
        this.uploadProgress++;
      }

      this.selectedImages = [];
      this.loadExistingImages();
      alert('Imágenes subidas correctamente');
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert(`Error al subir imágenes (${this.uploadProgress}/${this.uploadTotal} completadas)`);
    } finally {
      this.isUploading = false;
    }
  }

  onMultipleFilesSelected(event: any) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
  }

  removeSelectedImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageType === 'img1') {
      this.imgFile1 = file;
      this.imageUrl = URL.createObjectURL(file) as any;
    }
  }

  submitPhotoGallery() {
    const formData = new FormData();
    formData.append('LANGUAGE', this.currentLang as string);
    formData.append('TITLE', this.formattedHeaderText as string);
    formData.append('DESCRIPTION', this.formatteddescriptionText as string);
    if (this.imgFile1) formData.append('IMG_URL_1', this.imgFile1);

    this.photoGalleryService.addPhotogallery(formData).then(
      () => alert('PhotoGallery guardado correctamente'),
    ).catch(
      () => alert('Error al guardar PhotoGallery'),
    );
  }

  get formatteddescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }
  get formattedHeaderText(): string {
    return this.headerText.replace(/\n/g, '<br>');
  }
}
