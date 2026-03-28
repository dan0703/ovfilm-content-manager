import { Component } from '@angular/core';
import { WeddingHighlightCardComponent } from '../wedding-highlight-card/wedding-highlight-card.component';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
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
  reviews: Review[] = [];
  constructor(private reviewService: ReviewService) {}

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

  // File holders for all 9 images
  review1File1: File | null = null;
  review1File2: File | null = null;
  review1File3: File | null = null;
  review2File1: File | null = null;
  review2File2: File | null = null;
  review2File3: File | null = null;
  review3File1: File | null = null;
  review3File2: File | null = null;
  review3File3: File | null = null;

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

  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    //Review 1
    if (imageType === 'img1') {
      this.review1File1 = file;
      this.review1_Img1 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img2') {
      this.review1File2 = file;
      this.review1_Img2 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img3') {
      this.review1File3 = file;
      this.review1_Img3 = URL.createObjectURL(file) as any;
    }
    //Review 2
    else if (imageType === 'img4') {
      this.review2File1 = file;
      this.review2_Img1 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img5') {
      this.review2File2 = file;
      this.review2_Img2 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img6') {
      this.review2File3 = file;
      this.review2_Img3 = URL.createObjectURL(file) as any;
    }
    //Review 3
    else if (imageType === 'img7') {
      this.review3File1 = file;
      this.review3_Img1 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img8') {
      this.review3File2 = file;
      this.review3_Img2 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img9') {
      this.review3File3 = file;
      this.review3_Img3 = URL.createObjectURL(file) as any;
    }
    else {
      console.log('Imagen no encontrada');
    }
  }

  submitReviews() {
    const review1 = new FormData();
    review1.append('LANGUAGE', 'EN');
    review1.append('CODE', '1');
    review1.append('COUPLE_NAMES', this.coupleNames1 as string);
    review1.append('EVENT_DATE', this.weddingDate1 as string);
    review1.append('DESCRIPTION', this.comment1 as string);
    review1.append('VIDEO_LINK', this.videoId1 as string);
    if (this.review1File1) review1.append('IMG_URL_1', this.review1File1);
    if (this.review1File2) review1.append('IMG_URL_2', this.review1File2);
    if (this.review1File3) review1.append('IMG_URL_3', this.review1File3);

    const review2 = new FormData();
    review2.append('LANGUAGE', 'EN');
    review2.append('CODE', '2');
    review2.append('COUPLE_NAMES', this.coupleNames2 as string);
    review2.append('EVENT_DATE', this.weddingDate2 as string);
    review2.append('DESCRIPTION', this.comment2 as string);
    review2.append('VIDEO_LINK', this.videoId2 as string);
    if (this.review2File1) review2.append('IMG_URL_1', this.review2File1);
    if (this.review2File2) review2.append('IMG_URL_2', this.review2File2);
    if (this.review2File3) review2.append('IMG_URL_3', this.review2File3);

    const review3 = new FormData();
    review3.append('LANGUAGE', 'EN');
    review3.append('CODE', '3');
    review3.append('COUPLE_NAMES', this.coupleNames3 as string);
    review3.append('EVENT_DATE', this.weddingDate3 as string);
    review3.append('DESCRIPTION', this.comment3 as string);
    review3.append('VIDEO_LINK', this.videoId3 as string);
    if (this.review3File1) review3.append('IMG_URL_1', this.review3File1);
    if (this.review3File2) review3.append('IMG_URL_2', this.review3File2);
    if (this.review3File3) review3.append('IMG_URL_3', this.review3File3);

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
