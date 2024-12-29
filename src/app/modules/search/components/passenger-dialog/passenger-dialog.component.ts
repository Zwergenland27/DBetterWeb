import {Component, Inject, signal} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatPrefix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatChip,
  MatChipRemove,
  MatChipSet
} from '@angular/material/chips';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatTooltip} from '@angular/material/tooltip';
import {DiscountDto, PassengerDto, SearchService, UserDto} from '../../search.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {map, Observable, startWith} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatSelect} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';


export type SelectablePassenger = {
  id: string;
  name: string;
  email: string;
}

export type PassengerDialogData = {
  requestId: string;
  passengerToEdit: PassengerDto | null;
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
    MatSelect,
    MatMiniFabButton,
    MatCheckbox,
  ],
  templateUrl: './passenger-dialog.component.html',
  styleUrl: './passenger-dialog.component.css'
})
export class PassengerDialogComponent {
  private readonly journeyId: string;
  private availablePassengers : UserDto[] = [];

  private readonly editPassengerId : string | null = null;

  get editMode(){
    return this.editPassengerId != null;
  }
  public availableDiscounts: DiscountDto[] = [];
  discounts = signal<DiscountDto[]>([]);

  selectedPassengerId : string | null = null;
  filteredPassengers: Observable<SelectablePassenger[]>;

  public passengerForm = new FormGroup({
    name: new FormControl(''),
    birthday: new FormControl(''),
    age: new FormControl<number | null>(null, [Validators.min(0)]),
    withSeat: new FormControl(true),
    needsAccessibility: new FormControl(false),
    withBuggy: new FormControl(false),
    bikes: new FormControl(0, [Validators.required, Validators.min(0)]),
    dogs: new FormControl(0, [Validators.required, Validators.min(0)]),
  },{
    validators: [this.ageSelectedValidator]
  });

  constructor(@Inject(MAT_DIALOG_DATA)public data : PassengerDialogData,
              private searchService: SearchService,
              private dialogRef: MatDialogRef<PassengerDialogComponent>) {
    this.dialogRef.disableClose = true;

    this.journeyId = data.requestId;

    this.filteredPassengers = this.passengerForm.get('name')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
    this.setDiscounts([]);
    searchService.getAvailablePassengers(this.journeyId).subscribe(result => {
      this.availablePassengers = result;
    });

    if(data.passengerToEdit){
      this.editPassengerId = data.passengerToEdit.id;
      this.loadPassengerForEdit(data.passengerToEdit);
    }
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

  loadPassengerForEdit(passenger: PassengerDto) {
    this.selectedPassengerId = passenger.userId;

    const nameField = this.passengerForm.get('name')!;
    const birthdayField = this.passengerForm.get('birthday')!;
    const ageField = this.passengerForm.get('age')!;
    const seatField = this.passengerForm.get('withSeat')!;
    const buggyField = this.passengerForm.get('withBuggy')!;
    const wheelchairField = this.passengerForm.get('needsAccessibility')!;
    const bikesField = this.passengerForm.get('bikes')!;
    const dogsField = this.passengerForm.get('dogs')!;

    nameField.setValue(passenger.name);
    let birthday = '';
    if(passenger.birthday){
      birthday = passenger.birthday;
    }
    birthdayField.setValue(birthday);
    ageField.setValue(passenger.age);

    if(passenger.userId != null){
      nameField.disable();
      birthdayField.disable();
      ageField.disable();
    }

    this.setDiscounts(passenger.discounts);
    seatField.setValue(passenger.withSeat);
    buggyField.setValue(passenger.withBuggy);
    wheelchairField.setValue(passenger.needsAccessibility);

    bikesField.setValue(passenger.bikes);
    dogsField.setValue(passenger.dogs);
  }

  passengerSelected(selected: SelectablePassenger){
    this.selectedPassengerId = selected.id;

    const nameField = this.passengerForm.get('name')!;
    const birthdayField = this.passengerForm.get('birthday')!;
    const ageField = this.passengerForm.get('age')!;
    const seatField = this.passengerForm.get('withSeat')!;
    const buggyField = this.passengerForm.get('withBuggy')!;
    const accessibilityField = this.passengerForm.get('needsAccessibility')!;
    const bikesField = this.passengerForm.get('bikes')!;
    const dogsField = this.passengerForm.get('dogs')!;

    const passenger = this.availablePassengers.find(passenger => passenger.id === selected.id)!;
    this.availablePassengers = this.availablePassengers.filter(passenger => passenger.id !== selected.id);

    nameField.setValue(passenger.firstname + passenger.lastname);
    nameField.disable();

    birthdayField.setValue(passenger.birthday!);
    birthdayField.disable();
    ageField.disable();

    this.setDiscounts(passenger.discounts);
    seatField.setValue(passenger.seatPreference);
    buggyField.setValue(passenger.buggyPreference);
    accessibilityField.setValue(passenger.needsAccessibility);

    bikesField.setValue(passenger.bikePreference);
    dogsField.setValue(passenger.dogPreference);
  }

  ageSelectedValidator(control: AbstractControl) {
    const birthday = control.get('birthday')!;
    const age = control.get('age')!;

    if(birthday.value == '' && age.value == null){
      return {ageRequired: true};
    }

    return null;
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
    this.searchService.removePassenger(this.journeyId, this.editPassengerId!).subscribe(_ => {
      this.dialogRef.close(null);
    })
  }

  public editPassenger(){
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

    this.searchService.editPassenger(
      this.journeyId,
      this.editPassengerId!,
      this.selectedPassengerId,
      value.name!,
      birthday,
      age,
      value.withSeat!,
      value.bikes!,
      value.dogs!,
      value.withBuggy!,
      value.needsAccessibility!,
      this.discounts()
    ).subscribe(result => {
      this.dialogRef.close(result);
    })
  }

  public addPassenger(){
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
      this.selectedPassengerId,
      value.name!,
      birthday,
      age,
      value.withSeat!,
      value.bikes!,
      value.dogs!,
      value.withBuggy!,
      value.needsAccessibility!,
      this.discounts()
    ).subscribe(result => {
      this.dialogRef.close(result);
    })
  }

  public ageArray(){
    const array = [];
    array.push(null);
    for(let i = 0; i <= 120; i++){
      array.push(i);
    }
    return array;
  }

  public getArray(){
    const array = [];
    for(let i = 0; i <= 10; i++){
      array.push(i);
    }
    return array;
  }
}
