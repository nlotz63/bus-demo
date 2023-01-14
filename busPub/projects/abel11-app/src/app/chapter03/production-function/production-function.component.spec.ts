import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionFunctionComponent } from './production-function.component';

describe('ProductionFunctionComponent', () => {
  let component: ProductionFunctionComponent;
  let fixture: ComponentFixture<ProductionFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionFunctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
