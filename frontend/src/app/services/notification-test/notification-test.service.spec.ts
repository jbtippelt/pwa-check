import { TestBed } from '@angular/core/testing';

import { NotificationTestService } from './notification-test.service';

describe('NotificationTestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationTestService = TestBed.get(NotificationTestService);
    expect(service).toBeTruthy();
  });
});
