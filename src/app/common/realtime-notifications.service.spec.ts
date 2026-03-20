import { TestBed } from '@angular/core/testing';

import { RealtimeNotificationsService } from './realtime-notifications.service';

describe('RealtimeNotificationsService', () => {
  let service: RealtimeNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimeNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
