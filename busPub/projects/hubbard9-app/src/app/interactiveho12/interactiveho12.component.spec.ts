import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactiveho12Component } from './interactiveho12.component';

describe('Interactiveho12Component', () => {
  let component: Interactiveho12Component;
  let fixture: ComponentFixture<Interactiveho12Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactiveho12Component]
    });
    fixture = TestBed.createComponent(Interactiveho12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
