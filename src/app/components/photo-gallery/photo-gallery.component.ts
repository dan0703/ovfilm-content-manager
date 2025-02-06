import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { Image } from '../../models/image/image';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent {
  
  imageList: Image[] = [];
  thumbPosition: string = '0px';  
  activeImageIndex: number | null = null;
  images: { url: string, loaded: boolean }[] = [];
  currentIndex: number = 0;

  // async ngOnInit() {
  //   await this.loadImages();
  // }

  async loadImages() {
    const apiUrl = 'http://garmannetworks.online:781/imagelist';
    try {
      const response = await fetch(apiUrl);
      this.imageList = await response.json();
      // Poblar images con IMAGE_LINK y establecer loaded en false por defecto
      this.images = this.imageList.map((img: Image) => ({
        url: img.IMAGE_LINK,
        loaded: false
    }));

    } catch (error) {
      console.error('Error loading images:', error);
    }
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
