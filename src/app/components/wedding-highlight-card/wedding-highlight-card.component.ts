import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-wedding-highlight-card',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './wedding-highlight-card.component.html',
  styleUrl: './wedding-highlight-card.component.scss'
})
export class WeddingHighlightCardComponent {
  @Input() weddingReview: {
    name: string;
    date: string;
    reviewText: string;
    videoId: string;
    images: { src: string; alt: string }[];
  } = {
    name: '',
    date: '',
    reviewText: '',
    videoId: '',
    images: []
  };
  @Input() reverseOrder: boolean = false;
  get formattedCommentReviewText(): string {
    return this.weddingReview.reviewText.replace(/\n/g, '<br>');
  }
}
