import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { VideoComponent } from './components/video/video.component';
import { PhotoPageComponent } from './components/photo-page/photo-page.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { AddBlogComponent } from './components/add-blog/add-blog.component';

const routeConfig: Routes = [
  { path: ':lang', component: HomeComponent, title: 'Home page' },
  { path: ':lang/contact', component: ContactFormComponent, title: 'Contact form' },
  { path: ':lang/video/:index', component: VideoComponent, title: 'Video' },
  { path: ':lang/photo', component: PhotoPageComponent, title: 'Gallery' },
  { path: ':lang/blog', component: BlogListComponent, title: 'Blog' },
  { path: ':lang/blogDetail/:id', component: BlogDetailComponent, title: 'Blog Detail' },
  { path: ':lang/addBlog', component: AddBlogComponent, title: 'Add Blog' },
  { path: '', redirectTo: 'ES', pathMatch: 'full' } 
];

export default routeConfig;
