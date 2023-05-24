import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram5Component } from './key-diagram5.component';

describe('KeyDiagram5Component', () => {
  let component: KeyDiagram5Component;
  let fixture: ComponentFixture<KeyDiagram5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyDiagram5Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
