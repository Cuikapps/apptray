import { TestBed } from '@angular/core/testing';

import { WindowUtilService } from './window-util.service';

describe('WindowUtilService', () => {
  let service: WindowUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowUtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
