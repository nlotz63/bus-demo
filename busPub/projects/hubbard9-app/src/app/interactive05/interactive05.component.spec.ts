import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive05Component } from './interactive05.component';

describe('Interactive05Component', () => {
  let component: Interactive05Component;
  let fixture: ComponentFixture<Interactive05Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive05Component]
    });
    fixture = TestBed.createComponent(Interactive05Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
