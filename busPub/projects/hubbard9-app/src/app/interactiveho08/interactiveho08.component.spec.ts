import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho08Component } from './interactiveho08.component';

describe('Interactiveho08Component', () => {
  let component: Interactiveho08Component;
  let fixture: ComponentFixture<Interactiveho08Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho08Component]
    });
    fixture = TestBed.createComponent(Interactiveho08Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
