import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnemployDataComponent } from './unemploy-data.component';

describe('UnemployDataComponent', () => {
  let component: UnemployDataComponent;
  let fixture: ComponentFixture<UnemployDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UnemployDataComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(UnemployDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
