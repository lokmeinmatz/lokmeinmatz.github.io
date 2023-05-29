import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ArticleRef, BlogService } from '../blog.service';

@Component({
  selector: 'blog-cover',
  templateUrl: './blog-cover.component.html',
  styleUrls: ['./blog-cover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogCoverComponent {
  @Input()
  article: ArticleRef | undefined

  @HostBinding('class.ghost')
  get isGhost() {
    return !this.article
  }

  get articleLink() {
    return this.article && this.blogService.getPathForRef(this.article);
  }

  constructor(
    protected blogService: BlogService
  ) {}
}
