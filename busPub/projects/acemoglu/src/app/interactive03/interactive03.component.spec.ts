import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive03Component } from './interactive03.component';

describe('Interactive03Component', () => {
  let component: Interactive03Component;
  let fixture: ComponentFixture<Interactive03Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive03Component]
    });
    fixture = TestBed.createComponent(Interactive03Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
