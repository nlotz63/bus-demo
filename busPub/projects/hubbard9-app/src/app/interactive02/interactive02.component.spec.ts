import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interactive02Component } from './interactive02.component';

describe('Interactive15Component', () => {
  let component: Interactive02Component;
  let fixture: ComponentFixture<Interactive02Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Interactive02Component]
    });
    fixture = TestBed.createComponent(Interactive02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
