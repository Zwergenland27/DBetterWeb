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
import {DiscountDto, SearchService, UserDto} from '../../search.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';


export type SelectablePassenger = {
  id: string;
  name: string;
  email: string;
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
  templateUrl: './add-passenger-dialog.component.html',
  styleUrl: './add-passenger-dialog.component.css'
})
export class AddPassengerDialogComponent {
  private journeyId: string;
  private availablePassengers : UserDto[] = [];

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
    needsAccessibility: new FormControl(false),
    buggy: new FormControl(false),
  },{
    validators: [this.ageSelectedValidator]
  });

  constructor(@Inject(MAT_DIALOG_DATA)public data : string,
              private searchService: SearchService,
              private dialogRef: MatDialogRef<AddPassengerDialogComponent>) {
    this.dialogRef.disableClose = true;

    this.journeyId = data;

    this.filteredPassengers = this.passengerForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
    this.setDiscounts([]);
    searchService.getAvailablePassengers(this.journeyId).subscribe(result => {
      this.availablePassengers = result;
    });
  }

  private filter(value: string){
    if(value.length < 3) return [];
    const filterValue = value.toLowerCase();

    return this.availablePassengers
      .map(passenger =><SelectablePassenger> {
        id: passenger.id,
        name: passenger.firstname + passenger.lastname,
        email: passenger.email,
      })
      .filter(passenger =>
        passenger.name.toLowerCase().includes(filterValue) ||
        passenger.email.toLowerCase().includes(filterValue));
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

  passengerSelected(selected: SelectablePassenger){
    this.selectedPassengerId = selected.id;

    const nameField = this.passengerForm.get('name')!;
    const birthdayField = this.passengerForm.get('birthday')!;
    const ageField = this.passengerForm.get('age')!;
    const seatField = this.passengerForm.get('seat')!;
    const bikeField = this.passengerForm.get('bike')!;
    const dogField = this.passengerForm.get('dog')!;
    const buggyField = this.passengerForm.get('buggy')!;
    const accessibilityField = this.passengerForm.get('needsAccessibility')!;

    const passenger = this.availablePassengers.find(passenger => passenger.id === selected.id)!;
    this.availablePassengers = this.availablePassengers.filter(passenger => passenger.id !== selected.id);

    nameField.setValue(passenger.firstname + passenger.lastname);
    nameField.disable();

    birthdayField.setValue(passenger.birthday!);
    birthdayField.disable();
    ageField.disable();

    this.setDiscounts(passenger.discounts);
    seatField.setValue(passenger.seatPreference);
    bikeField.setValue(passenger.bikePreference > 0);
    dogField.setValue(passenger.dogPreference > 0);
    buggyField.setValue(passenger.buggyPreference);
    accessibilityField.setValue(passenger.needsAccessibility);
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

  public submitPassenger(){
    const value = this.passengerForm.getRawValue();

    let birthday : Date | null;
    let age : number | null;
    if(value.birthday == ''){
      birthday = null;
      age = value.age!;
    }else{
      birthday = new Date(value.birthday!);
      age = null;
    }

    this.searchService.addPassenger(
      this.journeyId,
      value.name!,
      birthday,
      age,
      value.seat!,
      value.bike! ? 1 : 0,
      value.dog! ? 1 : 0,
      value.buggy!,
      value.needsAccessibility!,
      this.discounts()
    ).subscribe(result => {
      this.dialogRef.close(result);
    })
  }
}
