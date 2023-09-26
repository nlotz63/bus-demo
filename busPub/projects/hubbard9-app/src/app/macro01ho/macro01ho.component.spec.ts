import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro01hoComponent } from './macro01ho.component';

describe('Macro01hoComponent', () => {
  let component: Macro01hoComponent;
  let fixture: ComponentFixture<Macro01hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro01hoComponent]
    });
    fixture = TestBed.createComponent(Macro01hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
