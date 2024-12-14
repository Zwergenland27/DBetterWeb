import {Component, Inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatChip,
  MatChipOption,
  MatChipRemove,
  MatChipSet
} from '@angular/material/chips';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {DiscountDto} from '../../search.service';
import {Passenger} from '../../models/passenger.model';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';


export type SelectablePassenger = {
  id: string;
  name: string;
}

@Component({
  selector: 'app-passenger-card-dialog',
  imports: [
    MatDialogModule,
    MatButton,
    MatLabel,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatPrefix,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatChipOption,
    MatChipSet,
    MatChipRemove,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatTooltip,
    MatError,
    MatAutocompleteModule,
    AsyncPipe,
    MatChip,
  ],
  templateUrl: './passenger-dialog.component.html',
  styleUrl: './passenger-dialog.component.css'
})
export class PassengerDialogComponent {
  private availablePassengers : Passenger[];

  editMode = false;
  public availableDiscounts: DiscountDto[] = [];
  discounts = signal<DiscountDto[]>([]);
  selectedPassengerId : string | null = null;
  filteredPassengers: Observable<SelectablePassenger[]>;

  public passengerForm = new FormGroup({
    name: new FormControl(''),
    birthday: new FormControl(''),
    age: new FormControl<number | null>(null, [Validators.min(0)]),
    seat: new FormControl(true),
    bike: new FormControl(false),
    dog: new FormControl(false),
    wheelchair: new FormControl(false),
    buggy: new FormControl(false),
  },{
    validators: [this.ageSelectedValidator]
  });

  constructor(@Inject(MAT_DIALOG_DATA)public data : Passenger[],private dialogRef: MatDialogRef<PassengerDialogComponent>) {
    this.dialogRef.disableClose = true;

    this.filteredPassengers = this.passengerForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
    this.setDiscounts([]);
    if(data.length === 1 && data[0].frontendId != null){
      this.availablePassengers = [];
      this.editPassenger(data[0]);
      this.editMode = true;
    }else{
      this.availablePassengers = data;
    }
  }

  private filter(value: string){
    if(value.length < 3) return [];
    const filterValue = value.toLowerCase();

    return this.availablePassengers
      .filter(passenger => passenger.name!.toLowerCase().includes(filterValue))
      .map(passenger =><SelectablePassenger> {
        id: passenger.id,
        name: passenger.name
      });
  }

  private setDiscounts(selectedDiscounts: DiscountDto[]) {
    const availableDiscounts = [
      { type: 'BahnCard25',   class: 'Second',  validUntil: ''},
      { type: 'BahnCard25',   class: 'First',   validUntil: ''},
      { type: 'BahnCard50',   class: 'Second',  validUntil: ''},
      { type: 'BahnCard50',   class: 'First',  validUntil: ''},
      { type: 'BahnCard100',   class: 'Second',  validUntil: ''},
      { type: 'BahnCard100',   class: 'First',  validUntil: ''},
    ];

    this.availableDiscounts = availableDiscounts.filter(discount =>
      selectedDiscounts.find(selectedDiscount => selectedDiscount.type == discount.type && selectedDiscount.class == discount.class ) == null);

    //slice ensures that the selectedDiscounts reference is not set to the discounts signal array leading to unwanted changes
    this.discounts.set(selectedDiscounts.slice());
  }

  editPassenger(passenger: Passenger) {
    this.selectedPassengerId = passenger.id;

    const nameField = this.passengerForm.get('name')!;
    const birthdayField = this.passengerForm.get('birthday')!;
    const ageField = this.passengerForm.get('age')!;
    const seatField = this.passengerForm.get('seat')!;
    const bikeField = this.passengerForm.get('bike')!;
    const dogField = this.passengerForm.get('dog')!;
    const buggyField = this.passengerForm.get('buggy')!;
    const wheelchairField = this.passengerForm.get('wheelchair')!;

    nameField.setValue(passenger.name);
    let birthday = '';
    if(passenger.birthday){
      birthday = passenger.birthday.toISOString()
    }
    birthdayField.setValue(birthday);
    ageField.setValue(passenger.age);

    if(passenger.id != null){
      nameField.disable();
      birthdayField.disable();
      ageField.disable();
    }

    this.setDiscounts(passenger.discounts);
    seatField.setValue(passenger.withSeat);
    bikeField.setValue(passenger.withBike);
    dogField.setValue(passenger.withDog);
    buggyField.setValue(passenger.withBuggy);
    wheelchairField.setValue(passenger.needsWheelchair);
  }

  passengerSelected(selected: SelectablePassenger){
    this.selectedPassengerId = selected.id;

    const nameField = this.passengerForm.get('name')!;
    const birthdayField = this.passengerForm.get('birthday')!;
    const ageField = this.passengerForm.get('age')!;
    const seatField = this.passengerForm.get('seat')!;
    const bikeField = this.passengerForm.get('bike')!;
    const dogField = this.passengerForm.get('dog')!;
    const buggyField = this.passengerForm.get('buggy')!;
    const wheelchairField = this.passengerForm.get('wheelchair')!;

    const passenger = this.availablePassengers.find(passenger => passenger.id === selected.id)!;
    this.availablePassengers = this.availablePassengers.filter(passenger => passenger.id !== selected.id);

    nameField.setValue(passenger.name);
    nameField.disable();

    birthdayField.setValue(passenger.birthday!.toISOString());
    birthdayField.disable();
    ageField.disable();

    this.setDiscounts(passenger.discounts);
    seatField.setValue(passenger.withSeat);
    bikeField.setValue(passenger.withBike);
    dogField.setValue(passenger.withDog);
    buggyField.setValue(passenger.withBuggy);
    wheelchairField.setValue(passenger.needsWheelchair);
  }

  ageSelectedValidator(control: AbstractControl) {
    const birthday = control.get('birthday')!;
    const age = control.get('age')!;

    if(birthday.value == '' && age.value == null){
      return {ageRequired: true};
    }

    return null;
  }

  public toggleMobilityOption(option: string){
    const control = this.passengerForm.get(option)!;
    control.setValue(!control.value);
  }

  public removeDiscount(discount: DiscountDto){
    this.discounts.set(this.discounts().filter(d => d != discount));
    this.availableDiscounts.push(discount);
  }

  public addDiscount(discount: DiscountDto){
    this.discounts().push(discount);
    this.availableDiscounts = this.availableDiscounts.filter(d => d != discount);
  }

  public removePassenger(){
    this.dialogRef.close(null);
  }

  public submitPassenger(){
    const value = this.passengerForm.getRawValue();
    let passenger : Passenger;
    if(value.birthday == '') {
      passenger = Passenger.withAge(
        value.name!,
        value.age!,
        value.seat!,
        value.bike!,
        value.dog!,
        value.buggy!,
        value.wheelchair!,
        this.discounts());
    }else if(this.selectedPassengerId == null){
      passenger = Passenger.withBirthday(
        value.name!,
        new Date(value.birthday!),
        value.seat!,
        value.bike!,
        value.dog!,
        value.buggy!,
        value.wheelchair!,
        this.discounts());
    }else{
      passenger = Passenger.fromKnownUser(
        this.selectedPassengerId,
        value.name!,
        new Date(value.birthday!),
        value.seat!,
        value.bike!,
        value.dog!,
        value.buggy!,
        value.wheelchair!,
        this.discounts());
    }
    this.dialogRef.close(passenger);
  }
}
