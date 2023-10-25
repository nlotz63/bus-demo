import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho07Component } from './interactiveho07.component';

describe('Interactiveho07Component', () => {
  let component: Interactiveho07Component;
  let fixture: ComponentFixture<Interactiveho07Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho07Component]
    });
    fixture = TestBed.createComponent(Interactiveho07Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
