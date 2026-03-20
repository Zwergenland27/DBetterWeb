import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopoverLengthOfStayComponent } from './stopover-length-of-stay.component';

describe('StopoverLengthOfStayComponent', () => {
  let component: StopoverLengthOfStayComponent;
  let fixture: ComponentFixture<StopoverLengthOfStayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StopoverLengthOfStayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopoverLengthOfStayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
