import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolowComponent } from './solow.component';

describe('SolowComponent', () => {
  let component: SolowComponent;
  let fixture: ComponentFixture<SolowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SolowComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SolowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
