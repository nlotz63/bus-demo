import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho09Component } from './interactiveho09.component';

describe('Interactiveho09Component', () => {
  let component: Interactiveho09Component;
  let fixture: ComponentFixture<Interactiveho09Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho09Component]
    });
    fixture = TestBed.createComponent(Interactiveho09Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
