import {Component, effect, input, output} from '@angular/core';
import {PassengerDialogComponent} from '../passenger-dialog/passenger-dialog.component';
import {DialogService} from '../../../../common/dialog/dialog.service';
import {PassengerOptionsData} from './passenger-options-data';
import {PassengerCardComponent} from '../passenger-card/passenger-card.component';
import {ToggleButtonComponent} from '../../../../common/toggle-button/toggle-button.component';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';

@Component({
  selector: 'passenger-options',
  imports: [
    PassengerCardComponent,
    ToggleButtonComponent,
    FloatingButtonComponent
  ],
  templateUrl: './passenger-options.component.html',
  styleUrl: './passenger-options.component.scss'
})
export class PassengerOptionsComponent {

  passengers = input.required<PassengerOptionsData[]>();
  comfortClass = input.required<ComfortClass>();
  passengersChange = output<PassengerOptionsData[]>();
  comfortClassChange = output<ComfortClass>();

  _comfortClass: ComfortClass = ComfortClass.Second;
  _passengers : PassengerOptionsData[] = [];

  constructor(private dialog: DialogService) {
    effect(() => {
      this._comfortClass = this.comfortClass();
      this._passengers = this.passengers();
    });
  }

  comfortClassOptions = [
    {key: ComfortClass.First, label: $localize`:@@first_class:1st class`,},
    {key: ComfortClass.Second, label: $localize`:@@second_class:2nd class`,},
  ];

  selectComfortClass(key: ComfortClass) {
    this._comfortClass = key;
    this.comfortClassChange.emit(this._comfortClass);
  }

  removePassenger(id: string){
    this._passengers = this._passengers.filter(passenger => passenger.id !== id);
    this.passengersChange.emit(this._passengers);
  }

  editPassenger(id: string){
    const passengerOptions = this._passengers.filter(passenger => passenger.id === id)[0];
    const index = this._passengers.indexOf(passengerOptions);
    const dialog = this.dialog.create(PassengerDialogComponent);
    dialog.onCompleted((result) => {
      this._passengers[index] = result;
      this.passengersChange.emit(this._passengers);
    });
    dialog.open(passengerOptions);
  }

  openDialog(){
    const dialog = this.dialog.create(PassengerDialogComponent);
    dialog.onCompleted((result) => {
      this._passengers.push(result);
      this.passengersChange.emit(this._passengers);
    });
    dialog.open();
  }
}
