import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive11Component } from './interactive11.component';

describe('Interactive11Component', () => {
  let component: Interactive11Component;
  let fixture: ComponentFixture<Interactive11Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive11Component]
    });
    fixture = TestBed.createComponent(Interactive11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
