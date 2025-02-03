import { Component } from '@angular/core';
import { WeddingHighlightCardComponent } from '../wedding-highlight-card/wedding-highlight-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [WeddingHighlightCardComponent, FormsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {

  extractNumbers(input: string): string {
    const match = input.match(/\d+/g); // Extrae todos los números de la cadena
    console.log(match);
    return match ? match.join('') : ''; // Une todos los números y los devuelve como string
  }
  

  //Review 1
  coupleNames1: string = '';
  weddingDate1: string = '';
  comment1: string = '';
  videoId1: string = '';
  review1_Img1: string = 'assets/w1-highlight-1.png';
  review1_Img2: string = 'assets/w1-highlight-2.png';
  review1_Img3: string = 'assets/w1-highlight-3.png';

  //Review 2
  coupleNames2: string = '';
  weddingDate2: string = '';
  comment2: string = '';
  videoId2: string = '';
  review2_Img1: string = 'assets/w1-highlight-1.png';
  review2_Img2: string = 'assets/w1-highlight-2.png';
  review2_Img3: string = 'assets/w1-highlight-3.png';

  //Review 3
  coupleNames3: string = '';
  weddingDate3: string = '';
  comment3: string = '';
  videoId3: string = '';
  review3_Img1: string = 'assets/w1-highlight-1.png';
  review3_Img2: string = 'assets/w1-highlight-2.png';
  review3_Img3: string = 'assets/w1-highlight-3.png';

    

    onFileSelected(event: Event, imageType: string) {
      const file = (event.target as HTMLInputElement).files?.[0];
  
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          //Review 1
          if (imageType === 'img1') {
            this.review1_Img1 = reader.result as string;
          } else if (imageType === 'img2') {
            this.review1_Img2 = reader.result as string;
          } else if (imageType === 'img3') {
            this.review1_Img3 = reader.result as string;
          }

          //Review 2
          else if (imageType === 'img4') {
            this.review2_Img1 = reader.result as string;
          } else if (imageType === 'img5') {
            this.review2_Img2 = reader.result as string;
          }
          else if (imageType === 'img6') {
            this.review2_Img3 = reader.result as string;
          } 

          //Review 3
          else if (imageType === 'img7') {
            this.review3_Img1 = reader.result as string;
          }
          else if (imageType === 'img8') {
            this.review3_Img2 = reader.result as string;
          } else if (imageType === 'img9') {
            this.review3_Img3 = reader.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    }
}