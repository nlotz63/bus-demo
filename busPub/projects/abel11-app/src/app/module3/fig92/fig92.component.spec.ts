import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fig92Component } from './fig92.component';

describe('Fig92Component', () => {
  let component: Fig92Component;
  let fixture: ComponentFixture<Fig92Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Fig92Component]
})
    .compileComponents();

    fixture = TestBed.createComponent(Fig92Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
