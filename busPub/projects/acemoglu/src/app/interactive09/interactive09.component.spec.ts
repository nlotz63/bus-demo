import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive09Component } from './interactive09.component';

describe('Interactive09Component', () => {
  let component: Interactive09Component;
  let fixture: ComponentFixture<Interactive09Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive09Component]
    });
    fixture = TestBed.createComponent(Interactive09Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
