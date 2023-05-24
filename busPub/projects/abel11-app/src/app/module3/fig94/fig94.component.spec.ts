import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fig94Component } from './fig94.component';

describe('Fig94Component', () => {
  let component: Fig94Component;
  let fixture: ComponentFixture<Fig94Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Fig94Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(Fig94Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
