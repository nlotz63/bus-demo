import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fig135Component } from './fig135.component';

describe('Fig135Component', () => {
  let component: Fig135Component;
  let fixture: ComponentFixture<Fig135Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Fig135Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(Fig135Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
