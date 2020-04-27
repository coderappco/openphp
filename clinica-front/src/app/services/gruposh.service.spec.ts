import { TestBed, inject } from '@angular/core/testing';

import { GruposhService } from './gruposh.service';

describe('GruposhService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GruposhService]
    });
  });

  it('should be created', inject([GruposhService], (service: GruposhService) => {
    expect(service).toBeTruthy();
  }));
});
