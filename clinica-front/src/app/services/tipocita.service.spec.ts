import { TestBed, inject } from '@angular/core/testing';

import { TipocitaService } from './tipocita.service';

describe('TipocitaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipocitaService]
    });
  });

  it('should be created', inject([TipocitaService], (service: TipocitaService) => {
    expect(service).toBeTruthy();
  }));
});
