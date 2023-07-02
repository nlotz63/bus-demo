import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive8Component } from './interactive8.component';

describe('Interactive8Component', () => {
  let component: Interactive8Component;
  let fixture: ComponentFixture<Interactive8Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive8Component]
    });
    fixture = TestBed.createComponent(Interactive8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
