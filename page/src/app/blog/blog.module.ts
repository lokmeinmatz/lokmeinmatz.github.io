import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsHomeComponent } from './blogs-home/blogs-home.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BlogCoverComponent } from './blog-cover/blog-cover.component';
import { BlogService } from './blog.service';
import { TuiActionModule, TuiPaginationModule } from '@taiga-ui/kit';
import { MarkdownModule } from 'ngx-markdown';
import { TuiSvgModule } from '@taiga-ui/core';

const routes: Routes = [
  {
    path: '',
    title: 'Matthias Kind | Blog',
    component: BlogsHomeComponent
  },
  {
    path: '**',
    loadComponent: () => import('./blog-content/blog-content.component').then(c => c.BlogContentComponent)
  }
];

@NgModule({
  declarations: [
    BlogsHomeComponent,
    BlogCoverComponent
  ],
  providers: [
    BlogService
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    HttpClientModule,
    TuiActionModule,
    TuiPaginationModule,
    TuiSvgModule
  ]
})
export class BlogModule { }
