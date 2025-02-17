import { Component, inject, Input } from '@angular/core';
import { Blog } from '../../models/blog/blog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { BlogSummary } from '../../models/blog/blog-summary';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image/image';
import { lastValueFrom } from 'rxjs';

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
  selectedImages: File[] = []; 
  description: string = '';
  img_1: string = 'assets/w1-highlight-1.png';
  img_2: string = 'assets/w1-highlight-2.png';
  img_3: string = 'assets/w1-highlight-3.png';

  constructor(private route: ActivatedRoute, private blogService: BlogService, private imageService: ImageService) {
    
  }
  async ngOnInit() {
    await this.logIn();
    
  }
  async logIn() {
    this.imageService.login('ovfilm@gmail.com', 'OV2025').subscribe({
      next: (response) => {
        console.log("Inicio de sesión exitoso:", response);
      },
      error: (error) => {
        console.error("Error al iniciar sesión:", error);
      }
    });
  }

  async uploadImage(): Promise<string> {
    console.log(this.selectedImages.length);
    let imageUrl: string = "";
    
    for (let image of this.selectedImages) {
      console.log(image.name);
      try {
        const uploadResponse = await lastValueFrom(this.imageService.uploadFile(image));
        console.log("Imagen subida con éxito:", uploadResponse);
        imageUrl = uploadResponse.url;
      } catch (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        break; 
      }
    }
    return imageUrl;
  }

  get formattedContentText_1(): string {
    return this.content_1.replace(/\n/g, '<br>');
  }

  get formattedContentText_2(): string {
    return this.content_2.replace(/\n/g, '<br>');
  }
  get formattedContentText_3(): string {
    return this.content_3.replace(/\n/g, '<br>');
  }


  async onFileSelected(event: any, imageType: string) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
    
    try {
      let imageUrl = await this.uploadImage();
      console.log('Imagen URL:', imageUrl);
      if(imageType === 'img1') {
        this.img_1 = imageUrl;
      } else if(imageType === 'img2') {
        this.img_2 = imageUrl;
      } else if(imageType === 'img3') {
        this.img_3 = imageUrl;
      } else {
        console.log('Imagen no encontrada');
      }
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
    }
  }

  blog: Blog | undefined;
  blogList: BlogSummary[] = [];

  submitArticle() {
    const articleData: Blog = {
      title: this.title,
      date: this.date,
      subtitle1: this.subtitle_1,
      content1: this.content_1,
      subtitle2: this.subtitle_2,
      content2: this.content_2,
      content3: this.content_3,
      imgUrl: this.img_1,
      imgUrl2: this.img_2,
      imgUrl3: this.img_3,
      id: 0,
      description: this.description
    };
    
    this.blogService.addArticle(articleData).then(
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
