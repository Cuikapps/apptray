import { TestBed } from '@angular/core/testing';

import { ApptrayService } from './apptray.service';

describe('ApptrayService', () => {
  let service: ApptrayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApptrayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
