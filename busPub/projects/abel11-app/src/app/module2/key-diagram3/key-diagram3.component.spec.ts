import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram3Component } from './key-diagram3.component';

describe('KeyDiagram3Component', () => {
  let component: KeyDiagram3Component;
  let fixture: ComponentFixture<KeyDiagram3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyDiagram3Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
