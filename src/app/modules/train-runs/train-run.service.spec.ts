import { TestBed } from '@angular/core/testing';

import { TrainRunService } from './train-run.service';

describe('TrainRunService', () => {
  let service: TrainRunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainRunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
