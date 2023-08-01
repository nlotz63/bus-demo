import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive10Component } from './interactive10.component';

describe('Interactive10Component', () => {
  let component: Interactive10Component;
  let fixture: ComponentFixture<Interactive10Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive10Component]
    });
    fixture = TestBed.createComponent(Interactive10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
