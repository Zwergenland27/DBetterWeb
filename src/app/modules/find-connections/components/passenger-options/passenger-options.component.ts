import {Component, effect, input, output} from '@angular/core';
import {PassengerDialogComponent} from '../passenger-dialog/passenger-dialog.component';
import {DialogService} from '../../../../common/dialog/dialog.service';
import {PassengerData} from './passenger-data';

@Component({
  selector: 'passenger-options',
  imports: [
  ],
  templateUrl: './passenger-options.component.html',
  styleUrl: './passenger-options.component.scss'
})
export class PassengerOptionsComponent {

  passengers = input.required<PassengerData[]>();
  passengersChange = output<PassengerData[]>();

  _passengers : PassengerData[] = [];

  constructor(private dialog: DialogService) {
    effect(() => {
      this._passengers = this.passengers();
    });
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
