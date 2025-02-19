import { Component, Input } from '@angular/core';
import { BlogSummary } from '../../models/blog/blog-summary';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent {
  @Input() blog!: BlogSummary;
  
  constructor(private route: ActivatedRoute, private router: Router) {}
    currentLang = '';
  
    async ngOnInit() {
      this.route.paramMap.subscribe(params => {
        const lang = params.get('lang');
        if (lang === 'EN' || lang === 'ES') {
          this.currentLang = lang;
        }
      });
    }
}