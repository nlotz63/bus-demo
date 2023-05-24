import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborDemandComponent } from './labor-demand.component';

describe('LaborDemandComponent', () => {
  let component: LaborDemandComponent;
  let fixture: ComponentFixture<LaborDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LaborDemandComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LaborDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
