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
  description: string = '';
  img_1: string = 'assets/w1-highlight-1.png';
  img_2: string = 'assets/w1-highlight-2.png';
  img_3: string = 'assets/w1-highlight-3.png';

  imgFile1: File | null = null;
  imgFile2: File | null = null;
  imgFile3: File | null = null;

  constructor(private route: ActivatedRoute, private blogService: BlogService) {

  }
  async ngOnInit() {}

  get formattedContentText_1(): string {
    return this.content_1.replace(/\n/g, '<br>');
  }

  get formattedContentText_2(): string {
    return this.content_2.replace(/\n/g, '<br>');
  }
  get formattedContentText_3(): string {
    return this.content_3.replace(/\n/g, '<br>');
  }


  onFileSelected(event: any, imageType: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (imageType === 'img1') {
      this.imgFile1 = file;
      this.img_1 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img2') {
      this.imgFile2 = file;
      this.img_2 = URL.createObjectURL(file) as any;
    } else if (imageType === 'img3') {
      this.imgFile3 = file;
      this.img_3 = URL.createObjectURL(file) as any;
    } else {
      console.log('Imagen no encontrada');
    }
  }

  blog: Blog | undefined;
  blogList: BlogSummary[] = [];

  submitArticle() {
    const formData = new FormData();
    formData.append('LANGUAGE', 'EN');
    formData.append('title', this.title as string);
    formData.append('subtitle1', this.subtitle_1 as string);
    formData.append('subtitle2', this.subtitle_2 as string);
    formData.append('description', this.description as string);
    formData.append('content1', this.content_1 as string);
    formData.append('content2', this.content_2 as string);
    formData.append('content3', this.content_3 as string);
    formData.append('date', this.date as string);
    if (this.imgFile1) formData.append('imgUrl', this.imgFile1);
    if (this.imgFile2) formData.append('imgUrl2', this.imgFile2);
    if (this.imgFile3) formData.append('imgUrl3', this.imgFile3);

    this.blogService.addArticle(formData).then(
      response => {
        alert('Artículo guardado correctamente');
      }
    ).catch(
      error => {
        alert('Hubo un error al guardar el artículo, Intenta con otro titulo');
      }
    );
  }
}
