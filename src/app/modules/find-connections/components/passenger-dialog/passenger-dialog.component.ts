import {Component, output, viewChild} from '@angular/core';
import {
  AutocompleteInputTextComponent
} from '../../../../common/autocomplete-input-text/autocomplete-input-text.component';
import {from, Observable} from 'rxjs';
import {InputNumberComponent} from '../../../../common/input-number/input-number.component';
import {ToggleButtonComponent} from '../../../../common/toggle-button/toggle-button.component';
import {InputCheckboxComponent} from '../../../../common/input-checkbox/input-checkbox.component';
import {DialogComponent} from '../../../../common/dialog/dialog.component';
import {Discount, DiscountComfortClass, DiscountType, PassengerData} from '../passenger-options/passenger-data';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';

enum SelectableDiscountClass{
  None = 'None',
  First = 'First',
  Second = 'Second',
}

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

  name: string = '';

  user = {
    id: undefined,
    value: this.name
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

  private passengerCompletedListener : (passenger: PassengerData) => void = () => {}

  open(){
    this.dialog().open();
  }

  onCompleted(listener: (passenger: PassengerData) => void){
    this.passengerCompletedListener = listener;
  }

  selectName(result:{id: string | undefined, value: string}){
    this.name = result.value;
    this.user.value = this.name;
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

  add(){
    if(!this.age){
      throw new Error("age is required");
    }

    if(this.bikes === undefined){
      throw new Error("bikes is required");
    }

    if(this.dogs === undefined){
      throw new Error("dogs is required");
    }

    const discounts : Discount[] = [];

    if(this.bahnCard25 != SelectableDiscountClass.None){
      discounts.push({
        type: DiscountType.BahnCard25,
        comfortClass: this.convertToComfortClass(this.bahnCard25)
      })
    }

    if(this.bahnCard50 != SelectableDiscountClass.None){
      discounts.push({
        type: DiscountType.BahnCard50,
        comfortClass: this.convertToComfortClass(this.bahnCard50)
      })
    }

    if(this.bahnCard100 != SelectableDiscountClass.None){
      discounts.push({
        type: DiscountType.BahnCard100,
        comfortClass: this.convertToComfortClass(this.bahnCard100)
      })
    }

    const passenger : PassengerData = {
      id: crypto.randomUUID(),
      name: this.name,
      age: this.age,
      bikes: this.bikes,
      dogs: this.dogs,
      discounts: discounts
    }

    this.passengerCompletedListener(passenger);
  }

  convertToComfortClass(discount: SelectableDiscountClass): DiscountComfortClass {
    if(discount === SelectableDiscountClass.None){
      throw new Error("Cannot convert from none to comfort class")
    }

    if(discount === SelectableDiscountClass.First){
      return DiscountComfortClass.First;
    }

    return DiscountComfortClass.Second;
  }
}
