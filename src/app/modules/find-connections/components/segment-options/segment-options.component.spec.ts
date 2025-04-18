import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentOptionsComponent } from './segment-options.component';

describe('SegmentOptionsComponent', () => {
  let component: SegmentOptionsComponent;
  let fixture: ComponentFixture<SegmentOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegmentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
