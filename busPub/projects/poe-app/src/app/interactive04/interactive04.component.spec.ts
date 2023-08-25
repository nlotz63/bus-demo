import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive04Component } from './interactive04.component';

describe('Interactive04Component', () => {
  let component: Interactive04Component;
  let fixture: ComponentFixture<Interactive04Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive04Component]
    });
    fixture = TestBed.createComponent(Interactive04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
