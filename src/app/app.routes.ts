import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { VideoComponent } from './components/video/video.component';
import { PhotoPageComponent } from './components/photo-page/photo-page.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';

const routeConfig: Routes = [
    {
      path: '',
      component: HomeComponent,
      title: 'Home page',
    },
    {
      path: 'contact',
      component: ContactFormComponent,
      title: 'Contact form',
    },
    {
        path: 'video/:index',
        component: VideoComponent,
        title: 'Video',
    },
    {
        path: 'photo',
        component: PhotoPageComponent,
        title: 'Gallery',
    },
    {
      path: 'blog',
      component: BlogListComponent,
      title: 'Blog',
    },
    {
      path: 'blogDetail/:id',
      component: BlogDetailComponent,
      title: 'Blog Detail',
    },
  ];

export default routeConfig;