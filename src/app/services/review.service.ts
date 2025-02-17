import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
import { AboutUs } from '../models/aboutUs/aboutUs';
import { Review } from '../models/review/review';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  
    // url = 'http://localhost:1624';
    url = 'http://garmannetworks.online:781';
      
    async addReviews(review1: Review, review2: Review, review3: Review): Promise<void> {
        try {
          await this.sendReview(review1);
          await this.sendReview(review2);
          await this.sendReview(review3);
      
          console.log('Los tres reviews fueron agregados con éxito.');
        } catch (error) {
          console.error('Error al agregar los reviews:', error);
        }
      }
      
    private async sendReview(review: Review): Promise<any> {
        try {
            const response = await fetch(`${this.url}/admin/review`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        });
        
        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
        const data = await response.json();
        console.log('Review agregado con éxito:', data);
        return data;
            
        } catch (error) {
        console.error('Error al agregar review:', error);
        throw error;
        }            
    }

  async getReviews(): Promise<Review[]>  {
    try {
      const response = await fetch(`${this.url}/reviewlist`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews ${response.status} ${response.statusText}`);
      }
      const reviews: Review[] = await response.json();
  
      return reviews;
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      return []; 
    }
  }
  

    
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
          `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }
}