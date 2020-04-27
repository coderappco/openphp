import { TestBed, inject } from '@angular/core/testing';

import { CitaService } from './cita.service';

describe('CitaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CitaService]
    });
  });

  it('should be created', inject([CitaService], (service: CitaService) => {
    expect(service).toBeTruthy();
  }));
});
