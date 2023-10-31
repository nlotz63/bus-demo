import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Macro02hoComponent } from './macro02ho.component';

describe('Macro02hoComponent', () => {
  let component: Macro02hoComponent;
  let fixture: ComponentFixture<Macro02hoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Macro02hoComponent]
    });
    fixture = TestBed.createComponent(Macro02hoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
