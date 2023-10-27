import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho10Component } from './interactiveho10.component';

describe('Interactiveho10Component', () => {
  let component: Interactiveho10Component;
  let fixture: ComponentFixture<Interactiveho10Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho10Component]
    });
    fixture = TestBed.createComponent(Interactiveho10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
