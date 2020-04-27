import { TestBed, inject } from '@angular/core/testing';

import { RangoseService } from './rangose.service';

describe('RangoseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RangoseService]
    });
  });

  it('should be created', inject([RangoseService], (service: RangoseService) => {
    expect(service).toBeTruthy();
  }));
});
