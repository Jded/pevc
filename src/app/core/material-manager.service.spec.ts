import { TestBed, inject } from '@angular/core/testing';

import { MaterialManagerService } from './material-manager.service';

describe('MaterialManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaterialManagerService]
    });
  });

  it('should be created', inject([MaterialManagerService], (service: MaterialManagerService) => {
    expect(service).toBeTruthy();
  }));
});
