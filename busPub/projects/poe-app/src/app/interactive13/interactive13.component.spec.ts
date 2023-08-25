import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive13Component } from './interactive13.component';

describe('Interactive13Component', () => {
  let component: Interactive13Component;
  let fixture: ComponentFixture<Interactive13Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive13Component]
    });
    fixture = TestBed.createComponent(Interactive13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
