import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../models/video/video';
import { VideoService } from '../../services/video.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  videoId: string = '';
  thumbnail: String = '';
  headerText: string = '';
  descriptionText: String='';
  imageUrl: string | ArrayBuffer | null = null;
  videoList: Video[] = [];
  @ViewChild('carousel') carousel!: ElementRef;

  videoService: VideoService= inject(VideoService);
  route: ActivatedRoute = inject(ActivatedRoute);
  sanitizedVideoUrl: SafeResourceUrl;

  get formattedheaderText(): string {
    return this.headerText.replace(/\n/g, '<br>');
  }
  get formatteddescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }

  deleteVideo(index: number): void {
    this.weddingReview.images.splice(index, 1);
    this.videoList.splice(index, 1);
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

  scrollCarousel(direction: number) {
    const carousel = this.carousel.nativeElement;
    const scrollAmount = 150;
    carousel.scrollLeft += direction * scrollAmount;
  }
  extractNumbers(input: string): string {
    const match = input.match(/\d+/g); 
    console.log(match);
    return match ? match.join('') : ''; 
  }

  constructor(private sanitizer: DomSanitizer) {
    this.videoService.getAllVideos().then((videoList: Video[]) => {
      this.videoList = videoList;
      this.weddingReview.images = this.videoList.map((video) => ({
        src: video.THUMBNAIL_LINK, 
        alt: 'Wedding video thumbnail', 
        videoId: this.extractNumbers(this.extractNumbers(video.VIDEO_LINK)), 
      }));
    });

    const videoId = parseInt(this.route.snapshot.params['index'], 10);
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&controls=1`
    );
  }
  activeImageIndex: number | null = null;
  updateVideoUrl(videoId: string, index: number): void {
    const baseUrl = 'https://player.vimeo.com/video/';
    const params = '?autoplay=1&loop=1&controls=1';
    this.activeImageIndex = index; 
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}${videoId}${params}`);
  }

  uploadVideo(videoId: string): void {
    this.videoService.getVideoThumbnail(this.extractNumbers(videoId)).then(({ thumbnail }) => { 
      this.thumbnail = thumbnail; 
      this.videoList.push({ VIDEO_LINK: videoId, THUMBNAIL_LINK: thumbnail });
      this.weddingReview.images = this.videoList.map((video) => ({
        src: video.THUMBNAIL_LINK, 
        alt: 'Wedding video thumbnail', 
        videoId: this.extractNumbers(video.VIDEO_LINK), 
      }));
      console.log('Video List:', this.videoList[0]);
    });
  }

  @Input() weddingReview: {
    images: { src: string; alt: string, videoId:string }[];
  } = {
    images: []
  };
}
