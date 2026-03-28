import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { VideoComponent } from './components/video/video.component';
import { PhotoPageComponent } from './components/photo-page/photo-page.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { AddBlogComponent } from './components/add-blog/add-blog.component';
import { ImageEditorComponent } from './components/image-editor/image-editor.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routeConfig: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: ':lang', component: HomeComponent, title: 'Home page', canActivate: [AuthGuard] },
  { path: ':lang/contact', component: ContactFormComponent, title: 'Contact form', canActivate: [AuthGuard] },
  { path: ':lang/video', component: VideoComponent, title: 'Video', canActivate: [AuthGuard] },
  { path: ':lang/photo', component: PhotoPageComponent, title: 'Gallery', canActivate: [AuthGuard] },
  { path: ':lang/blog', component: BlogListComponent, title: 'Blog', canActivate: [AuthGuard] },
  { path: ':lang/blogDetail/:id', component: BlogDetailComponent, title: 'Blog Detail', canActivate: [AuthGuard] },
  { path: ':lang/addBlog', component: AddBlogComponent, title: 'Add Blog', canActivate: [AuthGuard] },
  { path: ':lang/imageEditor', component: ImageEditorComponent, title: 'Image Editor', canActivate: [AuthGuard] },
  { path: '', redirectTo: 'ES', pathMatch: 'full' }
];

export default routeConfig;
