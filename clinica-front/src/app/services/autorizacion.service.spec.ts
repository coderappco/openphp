import { TestBed, inject } from '@angular/core/testing';

import { AutorizacionService } from './autorizacion.service';

describe('AutorizacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutorizacionService]
    });
  });

  it('should be created', inject([AutorizacionService], (service: AutorizacionService) => {
    expect(service).toBeTruthy();
  }));
});
