import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Review } from '../models/review/review';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

    url = environment.apiUrl;

  private prependUrl(path: any): any {
    if (path && !path.startsWith('http')) {
      return `${this.url}/${path}`;
    }
    return path;
  }
      
    async addReviews(review1: FormData, review2: FormData, review3: FormData): Promise<void> {
        try {
          await this.sendReview(review1);
          await this.sendReview(review2);
          await this.sendReview(review3);

          console.log('Los tres reviews fueron agregados con éxito.');
        } catch (error) {
          console.error('Error al agregar los reviews:', error);
        }
      }

    private async sendReview(formData: FormData): Promise<any> {
        try {
            const token = localStorage.getItem('ovfilm_jwt');
            const response = await fetch(`${this.url}/admin/review`, {
            method: 'PUT',
            headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            },
            body: formData,
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
      reviews.forEach((review: any) => {
        review.IMG_URL_1 = this.prependUrl(review.IMG_URL_1);
        review.IMG_URL_2 = this.prependUrl(review.IMG_URL_2);
        review.IMG_URL_3 = this.prependUrl(review.IMG_URL_3);
      });
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