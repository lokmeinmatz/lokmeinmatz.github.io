import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID, TransferState, makeStateKey } from '@angular/core';
import { Observable, firstValueFrom, map, of, shareReplay, take, tap } from 'rxjs';

export class NotFoundError extends Error {}

export interface ArticleRef {
  /**
   * Without the md extension
   */
  file: string;
  title: string;
  thumbnails?: Record<'default', string>;
  published?: string;
  tags?: string[];
  teaser?: string;
  state?: 'PUBLISHED' | 'WIP' | 'HIDDEN'
}

interface BlogsData {
  articles: ArticleRef[]
}

export interface LoadRefsParams {
  /**
   * @default 6
   */
  size?: number;
  page?: number;
}

export interface Page<T> {
  totalCount: number;
  hasNextPage: boolean;
  nodes: T[];
  page: number;
}

const BLOGS_KEY = makeStateKey<BlogsData>('blogs.json');

@Injectable()
export class BlogService {

  blogData$ =  this.transferState.hasKey(BLOGS_KEY) ?
    of(this.transferState.get<BlogsData>(BLOGS_KEY, {} as BlogsData)) :
    this.http.get<BlogsData>(this.toAssetUrl('/assets/blog/blogs.json')).pipe(
      tap(blogData => this.transferState.set(BLOGS_KEY, blogData)),
      shareReplay(1)
  );


  constructor(
    protected http: HttpClient,
    @Inject(DOCUMENT) protected document: Document,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected transferState: TransferState
  ) {}

  getPathForRef(ref: ArticleRef): string {
    return '/blog/' + ref.file;
  }

  getRefFromSlug(slug: string): Promise<ArticleRef> {
    console.debug('getRefFromSlug', slug);
    return firstValueFrom(this.blogData$).then(bd => {
      const ref = bd.articles.find(a => a.file === slug)
      if (!ref) throw new NotFoundError(slug);
      return ref;
    });
  }

  private toAssetUrl(path: string): string {
    if (isPlatformServer(this.platformId)) {
      return `http://localhost:4200${path}`;
    } else {
      return path;
    }
  }

  getContentFromSlug(slug: string): Promise<string> {
    console.debug('getContentFromSlug', slug, this.transferState);
    const key = makeStateKey<string>('blog_content_' + slug);
    if (this.transferState.hasKey(key)) return Promise.resolve(this.transferState.get(key, 'Error loading'));
    return firstValueFrom(this.http.get(this.toAssetUrl(`/assets/blog/${slug}.md`), { responseType: 'text' }))
      .then(content => {this.transferState.set(key, content); console.log('stored content ' + key); return content;})
      .catch(e => {throw new NotFoundError(slug)})
  }

  async getRefAndContentFromSlug(slug: string): Promise<{ ref: ArticleRef, content: string }> {
    const [ref, content] = await Promise.all([this.getRefFromSlug(slug), this.getContentFromSlug(slug)])
    return { ref, content };
  }

  loadRefs(params: LoadRefsParams): Observable<Page<ArticleRef>> {
    const page = params.page ?? 0;
    const size = params.size ?? 2;

    return this.blogData$.pipe(
      map(data => {
        const nodes = data.articles.slice(page * size, (page + 1) * size);
        return {
          nodes,
          totalCount: data.articles.length,
          hasNextPage: (page+1) * size < data.articles.length,
          page
        };
      })
    )
  }
}
