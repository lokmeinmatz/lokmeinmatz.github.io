import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-bar',
  templateUrl: './app-bar.component.html',
  styleUrls: ['./app-bar.component.scss']
})
export class AppBarComponent {
  
  get isBlogPage(): boolean {
    return this.router.url === 'blog';
  }

  @HostBinding('class.is-home')
  get isHome(): boolean {
    return this.router.url === '/';
  }

  @HostBinding('style.--home-anim')
  homeScrollState: number | undefined = undefined;


  constructor(
    protected router: Router,
    @Inject(DOCUMENT)
    protected document: Document 
  ) {
    this.updateScrollState();
  }


  @HostListener('window:scroll') 
  updateScrollState() {
    if (!this.isHome) return;
    const scrollTop = this.document.scrollingElement?.scrollTop ?? 0;

    this.homeScrollState = Math.min(1, scrollTop / (window.innerHeight / 3));
  }
}
