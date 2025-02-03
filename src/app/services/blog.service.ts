import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog/blog';
import { BlogSummary } from '../models/blog/blog-summary';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
    url = 'http://localhost:3000/blogs';

    async getAllBlogs(): Promise<BlogSummary[]>{
        const data = await fetch(this.url);
        return (await data.json()) ?? [];
    }
    
    async getBlogById(id: number): Promise<Blog | undefined> {
        const data = await fetch(`${this.url}/${id}`);
        return (await data.json()) ?? {};
    }
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(
          `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
        );
    }
}