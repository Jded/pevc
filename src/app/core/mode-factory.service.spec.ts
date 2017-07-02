import { TestBed, inject } from '@angular/core/testing';

import { ModeFactoryService } from './mode-factory.service';

describe('ModeFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModeFactoryService]
    });
  });

  it('should be created', inject([ModeFactoryService], (service: ModeFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
