import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro07hoComponent } from './macro07ho.component';

describe('Macro07hoComponent', () => {
  let component: Macro07hoComponent;
  let fixture: ComponentFixture<Macro07hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro07hoComponent]
    });
    fixture = TestBed.createComponent(Macro07hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
