import { TestBed } from '@angular/core/testing';

import { PageNotFoundGuard } from './page-not-found.guard';

describe('PageNotFoundGuard', () => {
  let guard: PageNotFoundGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PageNotFoundGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
