import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOptionsComponent } from './time-options.component';

describe('TimeOptionsComponent', () => {
  let component: TimeOptionsComponent;
  let fixture: ComponentFixture<TimeOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
