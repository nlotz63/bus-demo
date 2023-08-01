import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive14Component } from './interactive14.component';

describe('Interactive14Component', () => {
  let component: Interactive14Component;
  let fixture: ComponentFixture<Interactive14Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive14Component]
    });
    fixture = TestBed.createComponent(Interactive14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
