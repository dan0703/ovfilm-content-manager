import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  // constructor(private translate: TranslateService) {
  //   this.translate.setDefaultLang('en');
  // }

  // switchLanguage(language: string) {
  //   this.translate.use(language); 
  // }
}
