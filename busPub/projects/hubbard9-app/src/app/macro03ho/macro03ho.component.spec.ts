import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro03hoComponent } from './macro03ho.component';

describe('Macro03hoComponent', () => {
  let component: Macro03hoComponent;
  let fixture: ComponentFixture<Macro03hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro03hoComponent]
    });
    fixture = TestBed.createComponent(Macro03hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
