import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerOptionsComponent } from './passenger-options.component';

describe('PassengerOptionsComponent', () => {
  let component: PassengerOptionsComponent;
  let fixture: ComponentFixture<PassengerOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
