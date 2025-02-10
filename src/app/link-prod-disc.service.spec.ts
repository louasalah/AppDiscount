import { TestBed } from '@angular/core/testing';

import { LinkProdDiscService } from './link-prod-disc.service';

describe('LinkProdDiscService', () => {
  let service: LinkProdDiscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkProdDiscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
