import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive01Component } from './interactive01.component';

describe('Interactive01Component', () => {
  let component: Interactive01Component;
  let fixture: ComponentFixture<Interactive01Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive01Component]
    });
    fixture = TestBed.createComponent(Interactive01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
