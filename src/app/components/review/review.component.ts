import { Component } from '@angular/core';
import { WeddingHighlightCardComponent } from '../wedding-highlight-card/wedding-highlight-card.component';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ReviewService } from '../../services/review.service';
import { ImageService } from '../../services/image.service';
import { Review } from '../../models/review/review';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [WeddingHighlightCardComponent, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  extractNumbers(input: String): String {
    const match = input.match(/\d+/g); 
    return match ? match.join('') : ''; 
  }
  selectedImages: File[] = []; 
  reviews: Review[] = [];
  constructor(private imageService: ImageService, private reviewService: ReviewService) {}

  //Review 1
  coupleNames1: String = '';
  weddingDate1: String = '';
  comment1: String = '';
  videoId1: String = '';
  review1_Img1: String = 'assets/w1-highlight-1.png';
  review1_Img2: String = 'assets/w1-highlight-2.png';
  review1_Img3: String = 'assets/w1-highlight-3.png';

  //Review 2
  coupleNames2: String = '';
  weddingDate2: String = '';
  comment2: String = '';
  videoId2: String = '';
  review2_Img1: String = 'assets/w1-highlight-1.png';
  review2_Img2: String = 'assets/w1-highlight-2.png';
  review2_Img3: String = 'assets/w1-highlight-3.png';

  //Review 3
  coupleNames3: String = '';
  weddingDate3: String = '';
  comment3: String = '';
  videoId3: String = '';
  review3_Img1: String = 'assets/w1-highlight-1.png';
  review3_Img2: String = 'assets/w1-highlight-2.png';
  review3_Img3: String = 'assets/w1-highlight-3.png';
  
  async ngOnInit() {
    this.loadReviews(); 
  }

    private async loadReviews() {
      try {
        this.reviews = await this.reviewService.getReviews();
        if (this.reviews[0]) {
          this.coupleNames1 = this.reviews[0].COUPLE_NAMES;
          this.weddingDate1 = this.reviews[0].EVENT_DATE;
          this.comment1 = this.reviews[0].DESCRIPTION;
          this.videoId1 = this.reviews[0].VIDEO_LINK;
          this.review1_Img1 = this.reviews[0].IMG_URL_1 || 'assets/w1-highlight-1.png';
          this.review1_Img2 = this.reviews[0].IMG_URL_2 || 'assets/w1-highlight-1.png';
          this.review1_Img3 = this.reviews[0].IMG_URL_3 || 'assets/w1-highlight-1.png';
        }
        if (this.reviews[1]) {
          this.coupleNames2 = this.reviews[1].COUPLE_NAMES;
          this.weddingDate2 = this.reviews[1].EVENT_DATE;
          this.comment2 = this.reviews[1].DESCRIPTION;
          this.videoId2 =this.reviews[1].VIDEO_LINK;
          this.review2_Img1 = this.reviews[1].IMG_URL_1 || 'assets/w1-highlight-1.png';
          this.review2_Img2 = this.reviews[1].IMG_URL_2 || 'assets/w1-highlight-1.png';
          this.review2_Img3 = this.reviews[1].IMG_URL_3 || 'assets/w1-highlight-1.png';
        }
        if (this.reviews[2]) {
          this.coupleNames3 = this.reviews[2].COUPLE_NAMES;
          this.weddingDate3 = this.reviews[2].EVENT_DATE;
          this.comment3 = this.reviews[2].DESCRIPTION;
          this.videoId3 =this.reviews[2].VIDEO_LINK;
          this.review3_Img1 = this.reviews[2].IMG_URL_1 || 'assets/w1-highlight-1.png';
          this.review3_Img2 = this.reviews[2].IMG_URL_2 || 'assets/w1-highlight-1.png';
          this.review3_Img3 = this.reviews[2].IMG_URL_3 || 'assets/w1-highlight-1.png';
        }
      } catch (error) {
        console.error('Error al cargar reviews:', error);
      }
    }

  async uploadImage(): Promise<string> {
    let imageUrl: string = "";
      
    for (let image of this.selectedImages) {
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
    
  async onFileSelected(event: any, imageType: string) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
    
    try {
      let imageUrl = await this.uploadImage();
      //Review 1
      if(imageType === 'img1') {
        this.review1_Img1 = imageUrl;
      } else if(imageType === 'img2') {
        this.review1_Img2 = imageUrl;
      } else if(imageType === 'img3') {
        this.review1_Img3 = imageUrl;
      }
      //Review 2
      else if(imageType === 'img4') {
        this.review2_Img1 = imageUrl;
      } else if(imageType === 'img5') {
        this.review2_Img2 = imageUrl;
      } else if(imageType === 'img6') {
        this.review2_Img3 = imageUrl;
      } 
      //Review 3
      else if(imageType === 'img7') {
        this.review3_Img1 = imageUrl;
      } else if(imageType === 'img8') {
        this.review3_Img2 = imageUrl;
      } else if(imageType === 'img9') {
        this.review3_Img3 = imageUrl;
      } 
      else {
        console.log('Imagen no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
    }
  }

  submitReviews() {
    const review1: Review = {
      LANGUAGE: "EN",
      IMG_URL_1: this.review1_Img1,
      IMG_URL_2: this.review1_Img2,
      IMG_URL_3: this.review1_Img3,
      COUPLE_NAMES: this.coupleNames1,
      EVENT_DATE: this.weddingDate1,
      DESCRIPTION: this.comment1,
      VIDEO_LINK: this.videoId1,
      CODE: "1",
    };

    const review2: Review = {
      LANGUAGE: "EN",
      IMG_URL_1: this.review2_Img1,
      IMG_URL_2: this.review2_Img2,
      IMG_URL_3: this.review2_Img3,
      COUPLE_NAMES: this.coupleNames2,
      EVENT_DATE: this.weddingDate2,
      DESCRIPTION: this.comment2,
      VIDEO_LINK: this.videoId2,
      CODE: "2",
    };

    const review3: Review = {
      LANGUAGE: "EN",
      IMG_URL_1: this.review3_Img1,
      IMG_URL_2: this.review3_Img2,
      IMG_URL_3: this.review3_Img3,
      COUPLE_NAMES: this.coupleNames3,
      EVENT_DATE: this.weddingDate3,
      DESCRIPTION: this.comment3,
      VIDEO_LINK: this.videoId3,
      CODE: "3",
    };
    this.reviewService.addReviews(review1, review2, review3).then(
      response => {
        console.log('Reviews guardado con éxito', response);
        alert('Reviews guardado correctamente');
      }
    ).catch(
      error => {
        console.error('Error al guardar Review ', error);
        alert('Hubo un error al guardar Review , Intenta mas tarde');
      }
    );
  }     
}