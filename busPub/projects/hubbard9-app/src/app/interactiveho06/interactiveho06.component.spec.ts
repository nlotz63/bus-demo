import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho06Component } from './interactiveho06.component';

describe('Interactiveho06Component', () => {
  let component: Interactiveho06Component;
  let fixture: ComponentFixture<Interactiveho06Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho06Component]
    });
    fixture = TestBed.createComponent(Interactiveho06Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
