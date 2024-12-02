import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerDialogComponent } from './passenger-dialog.component';

describe('AddPassengerComponent', () => {
  let component: PassengerDialogComponent;
  let fixture: ComponentFixture<PassengerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
