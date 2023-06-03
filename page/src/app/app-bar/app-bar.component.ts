import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss']
})
export class AppBarComponent {
  
  isBlogPage$ = this.activatedRoute.url.pipe(
    map(u => u[0]?.path === 'blog')
  );

  constructor(
    protected activatedRoute: ActivatedRoute
  ) {}
}
