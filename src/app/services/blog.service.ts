import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
@Injectable({
  providedIn: 'root'
})
export class BlogService {


  
    // url = 'http://localhost:1624';
    url = 'http://garmannetworks.online:781';


      
  async addArticle(article: Blog): Promise<void> {
    try{
      const response = await fetch(`${this.url}/admin/article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),});
      if (!response.ok) {
        throw new Error(`Failed to add article: ${response.status} ${response.statusText}`);
      }else{
        console.log('Article added successfully');
      }
    }catch (error) {
      console.error('Error al agregar el artículo:', error);
    }
  }

    async getAllBlogs(): Promise<BlogSummary[]> {
      try {
          const response = await fetch(`${this.url}/articlelist`);
          
          if (!response.ok) {
              throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          
          return Array.isArray(data) ? data : []; 
      } catch (error) {
          console.error("Error fetching blogs:", error);
          return []; 
      }
  }
  
  async deleteArticle(_id: string | undefined): Promise<void> {
    try{
      const response = await fetch(`${this.url}/admin/article?_id=${_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.status} ${response.statusText}`);
      }else{
        console.log('Article deleted successfully');
      }
    }
    catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  }

  async getArticleById(id: number): Promise<Blog | undefined>  {
    try {
      const response = await fetch(`${this.url}/articlebyid?_id=${id}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
      }
      const data: Blog = await response.json();
  
      return data;
    } catch (error) {
      console.error('Error al obtener el artículo:', error);
      return undefined; 
    }
  }
  

    
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
          `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }
}