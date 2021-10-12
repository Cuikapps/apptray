import { TestBed } from '@angular/core/testing';

import { FormatParamService } from './format-param.service';

describe('FormatParamService', () => {
  let service: FormatParamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatParamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
