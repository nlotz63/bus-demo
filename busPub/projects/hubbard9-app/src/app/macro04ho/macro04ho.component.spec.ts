import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro04hoComponent } from './macro04ho.component';

describe('Macro04hoComponent', () => {
  let component: Macro04hoComponent;
  let fixture: ComponentFixture<Macro04hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro04hoComponent]
    });
    fixture = TestBed.createComponent(Macro04hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
