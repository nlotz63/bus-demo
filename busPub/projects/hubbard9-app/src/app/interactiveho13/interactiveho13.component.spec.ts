import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho13Component } from './interactiveho13.component';

describe('Interactiveho13Component', () => {
  let component: Interactiveho13Component;
  let fixture: ComponentFixture<Interactiveho13Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho13Component]
    });
    fixture = TestBed.createComponent(Interactiveho13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
