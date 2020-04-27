import { TestBed, inject } from '@angular/core/testing';

import { CamaService } from './cama.service';

describe('CamaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamaService]
    });
  });

  it('should be created', inject([CamaService], (service: CamaService) => {
    expect(service).toBeTruthy();
  }));
});
