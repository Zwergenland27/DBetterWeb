import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassengerDialogComponent } from './add-passenger-dialog.component';

describe('AddPassengerComponent', () => {
  let component: AddPassengerDialogComponent;
  let fixture: ComponentFixture<AddPassengerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPassengerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPassengerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
