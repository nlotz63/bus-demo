import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram7Component } from './key-diagram7.component';

describe('KeyDiagram7Component', () => {
  let component: KeyDiagram7Component;
  let fixture: ComponentFixture<KeyDiagram7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyDiagram7Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
