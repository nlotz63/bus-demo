import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesiredCapitalComponent } from './desired-capital.component';

describe('DesiredCapitalComponent', () => {
  let component: DesiredCapitalComponent;
  let fixture: ComponentFixture<DesiredCapitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesiredCapitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesiredCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
