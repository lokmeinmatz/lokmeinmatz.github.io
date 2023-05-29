import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { ArticleRef, BlogService } from '../blog.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'app-blog-content',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    RouterModule,
    TuiButtonModule,
    TuiSvgModule
  ],
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.scss']
})
export class BlogContentComponent {
  
  article$: Observable<{ ref?: ArticleRef, content?: string, error?: any }> = this.route.url.pipe(
    map(segments => segments.map(s => s.path).join('/')),
    switchMap(slug => this.blogService.getRefAndContentFromSlug(slug)),
    catchError(e => of({ error: e }))
  );

  constructor(
    protected route: ActivatedRoute,
    protected blogService: BlogService
  ) {}
}
