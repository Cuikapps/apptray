import { TestBed } from '@angular/core/testing';

import { ExecutablesService } from './executables.service';

describe('ExecutablesService', () => {
  let service: ExecutablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
