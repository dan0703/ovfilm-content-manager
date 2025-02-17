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
    name: String;
    date: String;
    reviewText: String;
    videoId: String;
    images: { src: String; alt: String }[];
  } = {
    name: '',
    date: '',
    reviewText: '',
    videoId: '',
    images: []
  };
  @Input() reverseOrder: boolean = false;
  get formattedCommentReviewText(): String {
    return this.weddingReview.reviewText.replace(/\n/g, '<br>');
  }
}
