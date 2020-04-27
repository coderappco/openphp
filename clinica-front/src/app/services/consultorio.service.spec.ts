import { TestBed, inject } from '@angular/core/testing';

import { ConsultorioService } from './consultorio.service';

describe('ConsultorioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultorioService]
    });
  });

  it('should be created', inject([ConsultorioService], (service: ConsultorioService) => {
    expect(service).toBeTruthy();
  }));
});
