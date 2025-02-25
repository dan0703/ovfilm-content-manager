import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isMenuOpen = false;
  currentLang = 'EN'; 

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  constructor(private route: ActivatedRoute, private router: Router) {}

  switchLanguage(language: string) {
    this.currentLang = language;
    const currentUrl = this.router.url.split('/').slice(2).join('/'); 
    this.router.navigate([`/${language}/${currentUrl}`]); 

  }
}
