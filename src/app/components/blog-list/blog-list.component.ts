import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BlogSummary } from '../../models/blog/blog-summary';
import { BlogCardComponent } from "../blog-card/blog-card.component";
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, BlogCardComponent],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent {
  blogList: BlogSummary[] = [];
  blogService: BlogService= inject(BlogService);
  constructor() {
    this.blogService.getAllBlogs().then((blogList: BlogSummary[]) => {
      this.blogList = blogList;
      console.log('Blog List:', this.blogList[0]);
    });
  }
}
