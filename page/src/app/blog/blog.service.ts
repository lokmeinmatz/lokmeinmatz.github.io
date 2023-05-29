import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map, shareReplay, take } from 'rxjs';

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

@Injectable()
export class BlogService {

  blogData$ = this.http.get<BlogsData>('/assets/blog/blogs.json').pipe(
    shareReplay(1)
  );

  constructor(
    protected http: HttpClient 
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

  getContentFromSlug(slug: string): Promise<string> {
    console.debug('getContentFromSlug', slug);
    return firstValueFrom(this.http.get(`/assets/blog/${slug}.md`, { responseType: 'text' })).catch(e => {throw new NotFoundError(slug)})
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
