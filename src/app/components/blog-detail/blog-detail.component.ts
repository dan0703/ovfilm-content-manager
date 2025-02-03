import { Component, inject, Input } from '@angular/core';
import { Blog } from '../../models/blog/blog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/blog/blog-summary';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent {
  // route: ActivatedRoute = inject(ActivatedRoute);
  // blogService = inject(BlogService);
  blog: Blog | undefined;
  blogList: BlogSummary[] = [];
  // constructor() {
  //   const blogId = parseInt(this.route.snapshot.params['id'], 10);
  //   this.blogService.getBlogById(blogId).then((blog: Blog | undefined) => {
  //     this.blog = blog;
  //   });
  //   this.blogService.getAllBlogs().then((blogList: BlogSummary[]) => {
  //     this.blogList = blogList;
  //     console.log('Blog List:', this.blogList[0]);
  //   });
  // }

  constructor(private route: ActivatedRoute, private blogService: BlogService) {
    this.blogService.getAllBlogs().then((blogList: BlogSummary[]) => {
      this.blogList = blogList;
      console.log('Blog List:', this.blogList[0]);
    });
  }

  ngOnInit() {
    this.loadBlog(); // Cargar la primera vez
    // Escuchar cambios en los parámetros
    this.route.params.subscribe(() => {
      this.loadBlog();
    });
  }
  private loadBlog() {
    const blogId = parseInt(this.route.snapshot.params['id'], 10);
    console.log('BlogDetailComponent', blogId);

    this.blogService.getBlogById(blogId).then((blog: Blog | undefined) => {
      this.blog = blog;
      console.log('Blog:', this.blog);
    });
  }
}
