import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../models/video/video';
import { VideoService } from '../../services/video.service';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { VideoGallery } from '../../models/video/videoGallery';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  videoId: String = '';
  thumbnail: String = '';
  headerText: String = '';
  descriptionText: String='';
  imageUrl: String= "";
  language: String = 'EN';
  videoList: Video[] = [];
  videoGallery: VideoGallery | undefined;
  selectedImages: File[] = []; 

  
  @ViewChild('carousel') carousel!: ElementRef;

  videoService: VideoService= inject(VideoService);
  route: ActivatedRoute = inject(ActivatedRoute);
  sanitizedVideoUrl: SafeResourceUrl;
  currentLang = '';

  get formattedheaderText(): string {
    return this.headerText.replace(/\n/g, '<br>');
  }
  get formatteddescriptionText(): string {
    return this.descriptionText.replace(/\n/g, '<br>');
  }
  async ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const lang = params.get('lang');
      if (lang === 'EN' || lang === 'ES') {
        this.currentLang = lang;
        this.loadVideoGallery(this.currentLang); 
      }
    });
  }
  private async loadVideoGallery(currentLang: string) {
    try {
      const videoGallery = await this.videoService.getVideoGallery(currentLang);
      if (videoGallery) {
        this.videoGallery = videoGallery;
        this.language = videoGallery.LANGUAGE;
        this.headerText = videoGallery.TITLE;
        this.imageUrl = videoGallery.IMG_URL_1 || 'assets/home-photo.png';
        this.descriptionText = videoGallery.DESCRIPTION;
      }
    } catch (error) {
      console.error('Error al cargar About Us:', error);
    }
  }

  deleteVideo(index: number): void {
    const videoId = this.videoList[index]._id;
    this.videoService.deleteVideo(videoId).then(() => {
      this.videoList.splice(index, 1);
      this.weddingReview.images.splice(index, 1);
    });
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

  scrollCarousel(direction: number) {
    const carousel = this.carousel.nativeElement;
    const scrollAmount = 150;
    carousel.scrollLeft += direction * scrollAmount;
  }
  extractNumbers(input: String): String {
    const match = input.match(/\d+/g); 
    console.log(match);
    return match ? match.join('') : ''; 
  }

  constructor(private sanitizer: DomSanitizer, private imageService: ImageService) {
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
  updateVideoUrl(videoId: String, index: number): void {
    const baseUrl = 'https://player.vimeo.com/video/';
    const params = '?autoplay=1&loop=1&controls=1';
    this.activeImageIndex = index; 
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}${videoId}${params}`);
  }

  uploadVideo(videoId: String): void {
    this.videoService.getVideoThumbnail(this.extractNumbers(videoId)).then(({ thumbnail }) => { 
      this.thumbnail = thumbnail; 
      this.videoList.push({ VIDEO_LINK: videoId, THUMBNAIL_LINK: thumbnail });
      this.videoService.addVideo({ VIDEO_LINK: videoId, THUMBNAIL_LINK: thumbnail }).then(() => {
        this.weddingReview.images = this.videoList.map((video) => ({
          src: video.THUMBNAIL_LINK, 
          alt: 'Wedding video thumbnail', 
          videoId: this.extractNumbers(video.VIDEO_LINK), 
        }));
        console.log('Video List:', this.videoList[0]);
      });
    });
  }
  
  submitVideoGallery() {
    const videoGalleryData: VideoGallery = {
      LANGUAGE: this.currentLang,
      IMG_URL_1: this.imageUrl,
      TITLE: this.formattedheaderText,
      DESCRIPTION: this.formatteddescriptionText
    };
    
    this.videoService.addVideoGallery(videoGalleryData).then(
      response => {
        console.log('About us guardado con éxito', response);
        alert('About us guardado correctamente');
      }
    ).catch(
      error => {
        console.error('Error al guardar about us', error);
        alert('Hubo un error al guardar about us, Intenta mas tarde');
      }
    );
  }  
        

  @Input() weddingReview: {
    images: { src: String; alt: String, videoId:String }[];
  } = {
    images: []
  };
}
