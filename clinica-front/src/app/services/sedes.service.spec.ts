import { TestBed, inject } from '@angular/core/testing';

import { SedesService } from './sedes.service';

describe('SedesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SedesService]
    });
  });

  it('should be created', inject([SedesService], (service: SedesService) => {
    expect(service).toBeTruthy();
  }));
});
