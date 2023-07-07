import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { ArticleRef, BlogService } from '../blog.service';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { Title } from '@angular/platform-browser';

declare const Zone: any;

@Component({
  selector: 'app-blog-content',
  standalone: true,
  imports: [
    CommonModule,
    MarkdownModule,
    RouterModule
  ],
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.scss']
})
export class BlogContentComponent {
  static readonly ROOT_BREADCRUMBS = [
    { title: 'Home', link: '/' },
    { title: 'Blog', link: '/blog' }
  ]
  
  breadCrumbs: { title: string, link: string }[] = [...BlogContentComponent.ROOT_BREADCRUMBS];


  article$: Observable<{ ref?: ArticleRef, content?: string, error?: any }> = this.route.url.pipe(
    map(segments => segments.map(s => s.path).join('/')),
    switchMap(slug => this.blogService.getRefAndContentFromSlug(slug)),
    tap(c => {
      this.breadCrumbs = [...BlogContentComponent.ROOT_BREADCRUMBS, { title: c.ref.title, link: `/blog/${c.ref.file}` }];
      this.title.setTitle(`Blog | ${c.ref.title}`);
    }),
    catchError(e => of({ error: e }))
  );

  private loadZoneTask: any;

  constructor(
    protected route: ActivatedRoute,
    protected blogService: BlogService,
    protected title: Title
  ) {
    /* this.loadZoneTask = Zone.current
    .scheduleMacroTask(
      `render-md`,
      () => { },
      {},
      () => { }
    ); */
  }

  onMdxError() {
    this.loadZoneTask?.invoke();
  }
  
  onMdxReady() {
    this.loadZoneTask?.invoke();
  }
}
