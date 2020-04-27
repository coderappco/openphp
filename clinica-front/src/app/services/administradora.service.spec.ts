import { TestBed, inject } from '@angular/core/testing';

import { AdministradoraService } from './administradora.service';

describe('AdministradoraService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministradoraService]
    });
  });

  it('should be created', inject([AdministradoraService], (service: AdministradoraService) => {
    expect(service).toBeTruthy();
  }));
});
