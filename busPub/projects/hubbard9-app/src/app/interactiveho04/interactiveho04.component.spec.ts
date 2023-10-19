import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho04Component } from './interactiveho04.component';

describe('Interactiveho04Component', () => {
  let component: Interactiveho04Component;
  let fixture: ComponentFixture<Interactiveho04Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho04Component]
    });
    fixture = TestBed.createComponent(Interactiveho04Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
