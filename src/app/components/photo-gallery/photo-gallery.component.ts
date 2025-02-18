import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { Image } from '../../models/image/image';
import { ImageService } from '../../services/image.service';
@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent {
  
  thumbPosition: string = '0px';  
  activeImageIndex: number | null = null;
  images: { url: string, loaded: boolean }[] = [];
  currentIndex: number = 0;
  @Input() imageList: Image[] = []; 
  async ngOnInit() {
    await this.loadImages();
  }
  constructor(private imageService: ImageService) {
  }
  loadImages() {
    this.imageService.getImages().subscribe({
      next: (data: Image[]) => {
        this.imageList = data;
        this.images = this.imageList.map((img: Image) => ({
          url: img.IMAGE_LINK,
          loaded: false
        }));
      },
      error: (error) => {
        console.error('Error loading images:', error);
      }
    });
  }


  imageLoaded(index: number) {
    this.imageList[index].loaded = true;  
  }

  onScroll(event: any) {
    const container = event.target;
    const scrollHeight = container.scrollHeight - container.clientHeight; 
    const scrollTop = container.scrollTop; 
    const thumbPosition = (scrollTop / scrollHeight) * 100; 
    this.thumbPosition = `${thumbPosition}%`; 
  }

  showPhoto(videoId: string, index: number): void {
    this.activeImageIndex = index; 
  }

  isImageViewerOpen: boolean = false; 
  currentImage: string | null = null; 
  
    openImageViewer(imageUrl: string, index: number) {
      this.currentImage = imageUrl;
      this.isImageViewerOpen = true;
      this.currentIndex = index;
    }
  
    closeImageViewer() {
      this.isImageViewerOpen = false;
      this.currentImage = null;
    }
}

// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, Input, ViewChild, AfterViewInit, PLATFORM_ID, Inject, NgModule } from '@angular/core';
// import { CarouselComponent } from "../carousel/carousel.component";
// import { Image } from '../../models/image/image';
// import { ImageService } from '../../services/image.service';
// import Masonry from 'masonry-layout'; 
// import { isPlatformBrowser } from '@angular/common';  // Importar la función isPlatformBrowser
// import { NgxMasonryModule } from 'ngx-masonry';

// @Component({
//   selector: 'app-photo-gallery',
//   standalone: true,
//   imports: [CommonModule, CarouselComponent, NgxMasonryModule],
//   templateUrl: './photo-gallery.component.html',
//   styleUrls: ['./photo-gallery.component.scss']
// })
// export class PhotoGalleryComponent implements AfterViewInit {

//   @NgModule({
//     imports: [NgxMasonryModule]
//   })

//   thumbPosition: string = '0px';  
//   activeImageIndex: number | null = null;
//   images: { url: string, loaded: boolean }[] = [];
//   currentIndex: number = 0;
//   @Input() imageList: Image[] = []; 
//   @ViewChild('masonryGrid') masonryGrid!: ElementRef;
//   private masonry: any; // Usamos `any` para evitar problemas de tipo

//   constructor(private imageService: ImageService, @Inject(PLATFORM_ID) private platformId: Object) {}

//   ngAfterViewInit() {
//     // Verificamos si estamos en el navegador antes de inicializar Masonry
//     if (isPlatformBrowser(this.platformId)) {
//       this.loadImages();
//     }
//   }

  // async loadImages() {
  //   this.imageService.getImages().subscribe({
  //     next: (data: Image[]) => {
  //       this.imageList = data;
  //       this.images = this.imageList.map((img: Image) => ({
  //         url: img.IMAGE_LINK,
  //         loaded: false
  //       }));

  //       // Esperar un momento para que todo el DOM esté disponible
  //       setTimeout(() => this.initMasonry(), 500);
  //     },
  //     error: (error) => {
  //       console.error('Error loading images:', error);
  //     }
  //   });
  // }

//   initMasonry() {
//     // Inicializa Masonry solo si estamos en el navegador
//     if (isPlatformBrowser(this.platformId) && this.masonryGrid && this.masonryGrid.nativeElement) {
//       this.masonry = new Masonry(this.masonryGrid.nativeElement, {
//         itemSelector: '.img-container',
//         columnWidth: '.img-container',
//         percentPosition: true,
//         gutter: 10
//       });

//       // Llamar a layout() para organizar las imágenes
//       if (this.masonry) {
//         this.masonry.layout();
//       }
//     }
//   }

//   imageLoaded(index: number) {
//     this.imageList[index].loaded = true;  
//     // Asegurarse de que Masonry se reorganice solo si está inicializado
//     if (this.masonry) {
//       this.masonry.layout();
//     }
//   }

//   onScroll(event: any) {
//     const container = event.target;
//     const scrollHeight = container.scrollHeight - container.clientHeight; 
//     const scrollTop = container.scrollTop; 
//     const thumbPosition = (scrollTop / scrollHeight) * 100; 
//     this.thumbPosition = `${thumbPosition}%`; 
//   }

//   showPhoto(videoId: string, index: number): void {
//     this.activeImageIndex = index; 
//   }

//   isImageViewerOpen: boolean = false; 
//   currentImage: string | null = null; 
  
//   openImageViewer(imageUrl: string, index: number) {
//     this.currentImage = imageUrl;
//     this.isImageViewerOpen = true;
//     this.currentIndex = index;
//   }
  
//   closeImageViewer() {
//     this.isImageViewerOpen = false;
//     this.currentImage = null;
//   }
// }
