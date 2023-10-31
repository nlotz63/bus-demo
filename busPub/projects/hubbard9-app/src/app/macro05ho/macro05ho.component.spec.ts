import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro05hoComponent } from './macro05ho.component';

describe('Macro05hoComponent', () => {
  let component: Macro05hoComponent;
  let fixture: ComponentFixture<Macro05hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro05hoComponent]
    });
    fixture = TestBed.createComponent(Macro05hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
