import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram8Component } from './key-diagram8.component';

describe('KeyDiagram8Component', () => {
  let component: KeyDiagram8Component;
  let fixture: ComponentFixture<KeyDiagram8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyDiagram8Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
