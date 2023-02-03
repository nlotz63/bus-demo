import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyDiagram4Component } from './key-diagram4.component';

describe('KeyDiagram4Component', () => {
  let component: KeyDiagram4Component;
  let fixture: ComponentFixture<KeyDiagram4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyDiagram4Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyDiagram4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
