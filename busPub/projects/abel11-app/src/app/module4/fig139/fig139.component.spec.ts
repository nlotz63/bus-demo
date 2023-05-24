import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fig139Component } from './fig139.component';

describe('Fig139Component', () => {
  let component: Fig139Component;
  let fixture: ComponentFixture<Fig139Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Fig139Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(Fig139Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
