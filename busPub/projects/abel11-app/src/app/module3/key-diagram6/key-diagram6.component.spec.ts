import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram6Component } from './key-diagram6.component';

describe('KeyDiagram6Component', () => {
  let component: KeyDiagram6Component;
  let fixture: ComponentFixture<KeyDiagram6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [KeyDiagram6Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
