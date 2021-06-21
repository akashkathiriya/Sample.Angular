import { TestBed } from '@angular/core/testing';

import { ParentDataMappingService } from './parent-data-mapping.service';

describe('ParentDataMappingService', () => {
  let service: ParentDataMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentDataMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
