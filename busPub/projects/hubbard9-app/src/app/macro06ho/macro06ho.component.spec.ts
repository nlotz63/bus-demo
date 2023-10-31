import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro06hoComponent } from './macro06ho.component';

describe('Macro06hoComponent', () => {
  let component: Macro06hoComponent;
  let fixture: ComponentFixture<Macro06hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro06hoComponent]
    });
    fixture = TestBed.createComponent(Macro06hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
