import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Matthias Kind',
    loadComponent: () => import('./views/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'impressum',
    title: 'Impressum',
    loadComponent: () => import('./views/legal/legal.component').then(c => c.LegalComponent)
  },
  {
    path: 'blog',
    title: 'Blog',
    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
