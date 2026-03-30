import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";
import { Image } from '../../models/image/image';
import { ImageService } from '../../services/image.service';
import { Subscription } from 'rxjs';
import { environment } from '../../config/environment';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnDestroy {

  thumbPosition: string = '0px';
  activeImageIndex: number | null = null;
  images: { url: string, thumbnailUrl: string, loaded: boolean }[] = [];
  currentIndex: number = 0;
  @Input() imageList: Image[] = [];
  isImageViewerOpen: boolean = false;
  currentImage: string | null = null;
  private imageSub?: Subscription;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.loadImages();
  }

  ngOnDestroy() {
    this.imageSub?.unsubscribe();
  }

  loadImages() {
    this.imageSub = this.imageService.getImages().subscribe({
      next: (data: Image[]) => {
        this.imageList = data;
        const apiUrl = environment.apiUrl;
        this.images = this.imageList.map((img: Image) => ({
          url: img.IMAGE_LINK.startsWith('http') ? img.IMAGE_LINK : `${apiUrl}/${img.IMAGE_LINK}`,
          thumbnailUrl: (img.THUMBNAIL_LINK || img.IMAGE_LINK).startsWith('http')
            ? (img.THUMBNAIL_LINK || img.IMAGE_LINK)
            : `${apiUrl}/${img.THUMBNAIL_LINK || img.IMAGE_LINK}`,
          loaded: false
        }));
      },
      error: (error) => {
        console.error('Error loading images:', error);
      }
    });
  }

  imageLoaded(index: number) {
    if (this.images[index]) {
      this.images[index].loaded = true;
    }
  }

  onScroll(event: any) {
    const container = event.target;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const scrollTop = container.scrollTop;
    const thumbPosition = (scrollTop / scrollHeight) * 100;
    this.thumbPosition = `${thumbPosition}%`;
  }

  openImageViewer(imageUrl: string, index: number) {
    this.currentImage = imageUrl;
    this.isImageViewerOpen = true;
    this.currentIndex = index;
  }

  closeImageViewer() {
    this.isImageViewerOpen = false;
    this.currentImage = null;
    this.currentIndex = 0;
  }
}
