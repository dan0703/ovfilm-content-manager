import { Component, inject, Input } from '@angular/core';
import { Blog } from '../../models/blog/blog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/blog/blog-summary';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './add-blog.component.html',
  styleUrl: './add-blog.component.scss'
})

export class AddBlogComponent {
  title: string = '';
  subtitle_1: string = '';
  date: string = '';
  subtitle_2: string = '';
  content_1: string = '';
  content_2: string = '';
  content_3: string = '';
  img_1: string = 'assets/w1-highlight-1.png';
  img_2: string = 'assets/w1-highlight-2.png';
  img_3: string = 'assets/w1-highlight-3.png';


  get formattedContentText_1(): string {
    return this.content_1.replace(/\n/g, '<br>');
  }

  get formattedContentText_2(): string {
    return this.content_2.replace(/\n/g, '<br>');
  }
  get formattedContentText_3(): string {
    return this.content_3.replace(/\n/g, '<br>');
  }
  onFileSelected(event: Event, imageType: string) {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        //Review 1
        if (imageType === 'img1') {
          this.img_1 = reader.result as string;
        } else if (imageType === 'img2') {
          this.img_2 = reader.result as string;
        } else if (imageType === 'img3') {
          this.img_3 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }


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
    // this.blogService.getAllBlogs().then((blogList: BlogSummary[]) => {
    //   this.blogList = blogList;
    // });
  }

  // ngOnInit() {
  //   this.loadBlog(); 
  //   this.route.params.subscribe(() => {
  //     this.loadBlog();
  //   });
  // }
  // private loadBlog() {
  //   const blogId = parseInt(this.route.snapshot.params['id'], 10);

  //   this.blogService.getBlogById(blogId).then((blog: Blog | undefined) => {
  //     this.blog = blog;
  //   });
  // }

}
