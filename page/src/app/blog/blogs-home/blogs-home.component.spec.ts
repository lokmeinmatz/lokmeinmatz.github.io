import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsHomeComponent } from './blogs-home.component';

describe('BlogsHomeComponent', () => {
  let component: BlogsHomeComponent;
  let fixture: ComponentFixture<BlogsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogsHomeComponent]
    });
    fixture = TestBed.createComponent(BlogsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
