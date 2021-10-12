import { TestBed } from '@angular/core/testing';

import { ReturningAgainGuard } from './returning-again.guard';

describe('ReturningAgainGuard', () => {
  let guard: ReturningAgainGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReturningAgainGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
