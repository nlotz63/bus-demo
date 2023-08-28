import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive15Component } from './interactive15.component';

describe('Interactive15Component', () => {
  let component: Interactive15Component;
  let fixture: ComponentFixture<Interactive15Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive15Component]
    });
    fixture = TestBed.createComponent(Interactive15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
