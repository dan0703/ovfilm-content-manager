import { Component } from '@angular/core';
import { ReviewComponent } from "../review/review.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReviewComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  headerText: string = '';
  imageUrl: string | ArrayBuffer | null = null;
  aboutTitle1: string = '';
  aboutText: string = ``;
  reviewsTitle: string = 'Reviews'

  aboutImage1: string | ArrayBuffer | null = 'assets/about-us1.png';
  aboutImage2: string | ArrayBuffer | null = 'assets/about-us2.png';

  onFileSelected(event: Event, imageType: string) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (imageType === 'home') {
          this.imageUrl = reader.result;
        } else if (imageType === 'about1') {
          this.aboutImage1 = reader.result;
        } else if (imageType === 'about2') {
          this.aboutImage2 = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  get formattedAboutText(): string {
    return this.aboutText.replace(/\n/g, '<br>');
  }

  get formattedAboutTitle1(): string {
    return this.aboutTitle1.replace(/\n/g, '<br>');
  }
}
