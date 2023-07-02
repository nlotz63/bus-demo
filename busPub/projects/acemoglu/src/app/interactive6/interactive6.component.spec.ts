import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive6Component } from './interactive6.component';

describe('Interactive6Component', () => {
  let component: Interactive6Component;
  let fixture: ComponentFixture<Interactive6Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive6Component]
    });
    fixture = TestBed.createComponent(Interactive6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
