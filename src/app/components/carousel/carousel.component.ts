import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input() images: { url: string, loaded: boolean }[] = [];
  @Input() currentIndex: number = 0; 

  @Output() close = new EventEmitter<void>();

  closeImageViewer() {
    this.close.emit(); 
  }
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  onImageLoad(index: number) {
    this.images[index].loaded = true;
  }
}
