import { TestBed, inject } from '@angular/core/testing';

import { CodifService } from './codif.service';

describe('CodifService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodifService]
    });
  });

  it('should be created', inject([CodifService], (service: CodifService) => {
    expect(service).toBeTruthy();
  }));
});
