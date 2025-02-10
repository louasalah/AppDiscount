import { TestBed } from '@angular/core/testing';

import { DiscountDefService } from './discount-def.service';

describe('DiscountDefService', () => {
  let service: DiscountDefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscountDefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
