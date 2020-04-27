import { TestBed, inject } from '@angular/core/testing';

import { NolaboralService } from './nolaboral.service';

describe('NolaboralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NolaboralService]
    });
  });

  it('should be created', inject([NolaboralService], (service: NolaboralService) => {
    expect(service).toBeTruthy();
  }));
});
