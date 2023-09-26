import { TestBed } from '@angular/core/testing';

import { MacroModelService } from './macro-model.service';

describe('MacroModelService', () => {
  let service: MacroModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MacroModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
