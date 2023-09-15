import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveHO03Component } from './interactive-ho03.component';

describe('InteractiveHO03Component', () => {
  let component: InteractiveHO03Component;
  let fixture: ComponentFixture<InteractiveHO03Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InteractiveHO03Component]
    });
    fixture = TestBed.createComponent(InteractiveHO03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
