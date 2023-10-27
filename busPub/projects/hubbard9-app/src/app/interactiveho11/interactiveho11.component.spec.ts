import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho11Component } from './interactiveho11.component';

describe('Interactiveho11Component', () => {
  let component: Interactiveho11Component;
  let fixture: ComponentFixture<Interactiveho11Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho11Component]
    });
    fixture = TestBed.createComponent(Interactiveho11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
