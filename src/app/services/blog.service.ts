import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    url = environment.apiUrl;


      
    async addArticle(formData: FormData): Promise<any> {
      try {
        console.log('Enviando artículo:', formData);

        const response = await fetch(`${this.url}/admin/article`, {
          method: 'POST',
          headers: this.authHeaders(),
          body: formData,
        });
    
        if (!response.ok) {
          const errorData = await response.json(); // Intenta obtener detalles del error
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('Artículo agregado con éxito:', data);
        return data; // Devuelve la respuesta para su uso posterior
    
      } catch (error) {
        console.error('Error al agregar el artículo:', error);
        throw error; // Relanza el error para manejarlo en el componente
      }
    }
    

    async getAllBlogs(): Promise<BlogSummary[]> {
      try {
          const response = await fetch(`${this.url}/articlelist`);
          
          if (!response.ok) {
              throw new Error(`Failed to fetch blogs: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
          const blogs = Array.isArray(data) ? data : [];
          blogs.forEach((blog: any) => {
            blog.imgUrl = this.prependUrl(blog.imgUrl);
          });
          return blogs; 
      } catch (error) {
          console.error("Error fetching blogs:", error);
          return []; 
      }
  }
  
  private authHeaders(): Record<string, string> {
    const token = localStorage.getItem('ovfilm_jwt');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  private prependUrl(path: any): any {
    if (path && !path.startsWith('http')) {
      return `${this.url}/${path}`;
    }
    return path;
  }

  async deleteArticle(_id: string | undefined): Promise<void> {
    try{
      const response = await fetch(`${this.url}/admin/article?_id=${_id}`, {
        method: 'DELETE',
        headers: this.authHeaders(),
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
      data.imgUrl = this.prependUrl(data.imgUrl);
      data.imgUrl2 = this.prependUrl(data.imgUrl2);
      data.imgUrl3 = this.prependUrl(data.imgUrl3);
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