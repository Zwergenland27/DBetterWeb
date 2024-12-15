import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerControlComponent } from './passenger-control.component';

describe('PassengerControlComponent', () => {
  let component: PassengerControlComponent;
  let fixture: ComponentFixture<PassengerControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
