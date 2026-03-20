import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainRunsComponent } from './train-runs.component';

describe('TrainRunsComponent', () => {
  let component: TrainRunsComponent;
  let fixture: ComponentFixture<TrainRunsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainRunsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainRunsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
