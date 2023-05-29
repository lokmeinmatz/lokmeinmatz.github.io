import { Component } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { BlogService } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blogs-home',
  templateUrl: './blogs-home.component.html',
  styleUrls: ['./blogs-home.component.scss']
})
export class BlogsHomeComponent {

  readonly pageSize = 2;
  page$ = new BehaviorSubject(0);
  articles$ = this.page$.pipe(
    distinctUntilChanged(),
    switchMap(page => this.blogService.loadRefs({ page, size: this.pageSize }))
  );

  pageCount$ = this.articles$.pipe(
    map(p => Math.max(1, Math.floor(p.totalCount / this.pageSize)))
  );

  constructor(
    protected blogService: BlogService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    this.route.queryParamMap.subscribe(params => {
      const rawPage = params.get('page');
      const page: number = rawPage ? parseInt(rawPage) : 0;
      this.page$.next(page); 
    });
    this.page$.subscribe(newPage => this.router.navigate([], {
      queryParams: { page: newPage > 0 ? newPage : null },
      queryParamsHandling: 'merge' 
    }));
  }

  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
  
}
