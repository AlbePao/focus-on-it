import { TestBed } from '@angular/core/testing';

import { CanDeactivateHomeGuard } from './can-deactivate-home.guard';

describe('CanDeactivateHomeGuard', () => {
  let guard: CanDeactivateHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
