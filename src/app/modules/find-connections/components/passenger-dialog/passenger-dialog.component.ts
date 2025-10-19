import {Component, output, viewChild} from '@angular/core';
import {
  AutocompleteInputTextComponent
} from '../../../../common/autocomplete-input-text/autocomplete-input-text.component';
import {from, Observable} from 'rxjs';
import {InputNumberComponent} from '../../../../common/input-number/input-number.component';
import {ToggleButtonComponent} from '../../../../common/toggle-button/toggle-button.component';
import {InputCheckboxComponent} from '../../../../common/input-checkbox/input-checkbox.component';
import {DialogComponent} from '../../../../common/dialog/dialog.component';
import {
  Discount,
  DiscountComfortClass,
  DiscountType,
  PassengerOptionsData,
  SelectableDiscountClass
} from '../passenger-options/passenger-options-data';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';

@Component({
  selector: 'passenger-dialog',
  imports: [
    AutocompleteInputTextComponent,
    InputNumberComponent,
    ToggleButtonComponent,
    InputCheckboxComponent,
    DialogComponent
  ],
  templateUrl: './passenger-dialog.component.html',
  styleUrl: './passenger-dialog.component.scss'
})
export class PassengerDialogComponent {
  dialog = viewChild.required<DialogComponent>('dialog');

  closed = output();

  editMode = false;

  discountComfortClasses : {
    key: SelectableDiscountClass,
    label: string
  }[] = [
    {
      key: SelectableDiscountClass.None,
      label: 'none',
    },
    {
      key: SelectableDiscountClass.First,
      label: '1st class',
    },
    {
      key: SelectableDiscountClass.Second,
      label: '2nd class',
    }
  ]

  id = '';

  user : { id: string | undefined, value: string, } = {
    id: undefined,
    value: ''
  };

  age: number | undefined = undefined;
  bikes: number | undefined = 0;
  dogs: number | undefined = 0;

  hasDeutschlandTicket = false;
  hasHalbtexAbo = false;
  hasKlimaTicket = false;
  hasNl40 = false;
  hasVorteilscard = false;

  bahnCard25 : SelectableDiscountClass = SelectableDiscountClass.None;
  bahnCard25Business : SelectableDiscountClass = SelectableDiscountClass.None;
  bahnCard50 : SelectableDiscountClass = SelectableDiscountClass.None;
  bahnCard50Business : SelectableDiscountClass = SelectableDiscountClass.None
  bahnCard100 : SelectableDiscountClass = SelectableDiscountClass.None
  chGeneral : SelectableDiscountClass = SelectableDiscountClass.None

  get dialogTitle(){
    return this.editMode
      ? $localize`:@@edit_passenger:Edit passenger`
      : $localize`:@@add_passenger:Add passenger`
  }

  get primaryButtonText(){
    return this.editMode
      ? $localize`:@@apply:Apply`
      : $localize`:@@add:Add`
  }

  private passengerCompletedListener : (passenger: PassengerOptionsData) => void = () => {}

  open(passengerOptions: PassengerOptionsData | null = null){
    if(passengerOptions){
      this.id = passengerOptions.id;
      this.user = {
        id: undefined,
        value: passengerOptions.name ?? ''
      }
      this.age = passengerOptions.age;

      this.bikes = passengerOptions.bikes;
      this.dogs = passengerOptions.dogs;

      this.bahnCard25 = passengerOptions.bahnCard25;
      this.bahnCard50 = passengerOptions.bahnCard50;
      this.bahnCard100 = passengerOptions.bahnCard100;
      this.editMode = true;
    }else{
      this.id = crypto.randomUUID()
    }
    this.dialog().open();
  }

  onCompleted(listener: (passenger: PassengerOptionsData) => void){
    this.passengerCompletedListener = listener;
  }

  selectName(result:{id: string | undefined, value: string}){
    this.user = result;
  }

  selectAge(result:{value: number | undefined}){
    this.age = result.value;
  }

  selectBikes(result:{value: number | undefined}){
    this.bikes = result.value;
  }

  selectDogs(result:{value: number | undefined}){
    this.dogs = result.value;
  }

  autocomplete = (value: string) : Observable<{id: string, value: string}[]> => {
    return from([]);
  }

  primaryClicked(){
    if(!this.age){
      throw new Error("age is required");
    }

    if(this.bikes === undefined){
      throw new Error("bikes is required");
    }

    if(this.dogs === undefined){
      throw new Error("dogs is required");
    }

    const passenger : PassengerOptionsData = {
      id: this.id,
      userId: null,
      name: this.user.value,
      age: this.age,
      bikes: this.bikes,
      dogs: this.dogs,
      bahnCard25: this.bahnCard25,
      bahnCard50: this.bahnCard50,
      bahnCard100: this.bahnCard100,
    }

    this.passengerCompletedListener(passenger);
    this.dialog().close();
  }
}
