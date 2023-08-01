import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive12Component } from './interactive12.component';

describe('Interactive12Component', () => {
  let component: Interactive12Component;
  let fixture: ComponentFixture<Interactive12Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive12Component]
    });
    fixture = TestBed.createComponent(Interactive12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
