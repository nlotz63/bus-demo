import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Figure31Component } from './figure31.component';

describe('Figure31Component', () => {
  let component: Figure31Component;
  let fixture: ComponentFixture<Figure31Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Figure31Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Figure31Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
