import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive5Component } from './interactive5.component';

describe('Interactive5Component', () => {
  let component: Interactive5Component;
  let fixture: ComponentFixture<Interactive5Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive5Component]
    });
    fixture = TestBed.createComponent(Interactive5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
