import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fig134Component } from './fig134.component';

describe('Fig134Component', () => {
  let component: Fig134Component;
  let fixture: ComponentFixture<Fig134Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fig134Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fig134Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
