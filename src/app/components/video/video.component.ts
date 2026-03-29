import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../models/video/video';
import { VideoService } from '../../services/video.service';
import { FormsModule } from '@angular/forms';
import { VideoGallery } from '../../models/video/videoGallery';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {

  videoId: String = '';
  videoLink: String = '994284832';
  thumbnail: String = '';
  headerText: String = '';
  descriptionText: String='';
  imageUrl: String= "";
  language: String = 'EN';
  videoList: Video[] = [];
  videoGallery: VideoGallery | undefined;

  imgFile1: File | null = null;


  @ViewChild('carousel') carousel!: ElementRef;

  videoService: VideoService= inject(VideoService);
  route: ActivatedRoute = inject(ActivatedRoute);
  sanitizedVideoUrl: SafeResourceUrl;
  currentLang = '';

  get formattedheaderText(): string {
    return (this.headerText || '').replace(/\n/g, '<br>');
  }
  get formatteddescriptionText(): string {
    return (this.descriptionText || '').replace(/\n/g, '<br>');
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
        this.videoId = this.extractNumbers(videoGallery.VIDEO_LINK)
        this.videoLink = videoGallery.VIDEO_LINK;
        this.updateVideoUrl(this.videoId, 0);
      }
    } catch (error) {
      console.error('Error al cargar About Us:', error);
    }
  }

  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageType === 'img1') {
      this.imgFile1 = file;
      this.imageUrl = URL.createObjectURL(file) as any;
    } else {
      console.log('Imagen no encontrada');
    }
  }

  deleteVideo(index: number): void {
    const videoId = this.videoList[index]._id;
    this.videoService.deleteVideo(videoId).then(() => {
      this.videoList.splice(index, 1);
      this.weddingReview.images.splice(index, 1);
    });
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

  constructor(private sanitizer: DomSanitizer) {

    this.videoService.getAllVideos().then((videoList: Video[]) => {
      this.videoList = Array.isArray(videoList) ? videoList : [];
      this.weddingReview.images = this.videoList.map((video) => ({
        src: video.THUMBNAIL_LINK,
        alt: 'Wedding video thumbnail',
        videoId: this.extractNumbers(video.VIDEO_LINK),
      }));
    });

    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://player.vimeo.com/video/${this.videoId}?autoplay=1&loop=1&controls=1`
    );
  }
  activeImageIndex: number | null = null;

  updateVideoUrl(videoId: String, index: number): void {
    const baseUrl = 'https://player.vimeo.com/video/';
    const params = '?autoplay=1&loop=1&controls=1';
    this.activeImageIndex = index;
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}${videoId}${params}`);
  }

  uploadMainVideo(videoLink: String): void {
    this.videoLink = videoLink;
      this.updateVideoUrl(this.extractNumbers(this.videoLink), 0);
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

  setDefaultVideo() {
    if (!this.videoLink) {
      alert('Ingresa un link de video primero');
      return;
    }
    const formData = new FormData();
    formData.append('LANGUAGE', this.currentLang);
    formData.append('TITLE', this.formattedheaderText);
    formData.append('DESCRIPTION', this.formatteddescriptionText);
    formData.append('VIDEO_LINK', this.videoLink.toString());

    this.videoService.addVideoGallery(formData).then(
      () => alert('Video principal asignado correctamente'),
    ).catch(
      (error: any) => alert('Error al asignar video: ' + (error?.message || error)),
    );
  }

  submitVideoGallery() {
    const formData = new FormData();
    formData.append('LANGUAGE', this.currentLang);
    formData.append('TITLE', this.formattedheaderText);
    formData.append('DESCRIPTION', this.formatteddescriptionText);
    formData.append('VIDEO_LINK', this.videoLink.toString());
    if (this.imgFile1) formData.append('IMG_URL_1', this.imgFile1);

    console.log('submitVideoGallery:', {
      LANGUAGE: this.currentLang,
      TITLE: this.formattedheaderText,
      VIDEO_LINK: this.videoLink.toString(),
      hasImage: !!this.imgFile1,
    });

    this.videoService.addVideoGallery(formData).then(
      response => {
        console.log('VideoGallery guardado con éxito', response);
        alert('VideoGallery guardado correctamente');
      }
    ).catch(
      error => {
        console.error('Error al guardar VideoGallery:', error);
        alert('Error al guardar VideoGallery: ' + (error?.message || error));
      }
    );
  }


  @Input() weddingReview: {
    images: { src: String; alt: String, videoId:String }[];
  } = {
    images: []
  };
}
