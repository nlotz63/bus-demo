import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive7Component } from './interactive7.component';

describe('Interactive7Component', () => {
  let component: Interactive7Component;
  let fixture: ComponentFixture<Interactive7Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive7Component]
    });
    fixture = TestBed.createComponent(Interactive7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
