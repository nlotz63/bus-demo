import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ch03PlayerComponent } from './ch03-player.component';

describe('Ch03PlayerComponent', () => {
  let component: Ch03PlayerComponent;
  let fixture: ComponentFixture<Ch03PlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ch03PlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ch03PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
