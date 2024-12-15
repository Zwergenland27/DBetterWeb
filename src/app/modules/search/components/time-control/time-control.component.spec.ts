import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeControlComponent } from './time-control.component';

describe('TimeControlComponent', () => {
  let component: TimeControlComponent;
  let fixture: ComponentFixture<TimeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
