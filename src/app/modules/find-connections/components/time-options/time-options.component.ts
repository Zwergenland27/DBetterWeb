import {Component, effect, input, output} from '@angular/core';
import {ToggleButtonComponent} from '../../../../common/toggle-button/toggle-button.component';
import {TimeOptionsData} from './time-options-data';
import {DateInputComponent} from '../../../../common/date-input/date-input.component';
import {TimeInputComponent} from '../../../../common/time-input/time-input.component';
import {IconButtonMiniComponent} from '../../../../common/icon-button-mini/icon-button-mini.component';

@Component({
  selector: 'time-options',
  imports: [
    ToggleButtonComponent,
    DateInputComponent,
    TimeInputComponent,
    IconButtonMiniComponent
  ],
  templateUrl: './time-options.component.html',
  styleUrl: './time-options.component.scss'
})
export class TimeOptionsComponent {

  options = [{key: 'departure', label: 'Departure',}, {key: 'arrival', label: 'Arrival'}];

  timeOptions = input.required<TimeOptionsData>();
  timeOptionsChange = output<TimeOptionsData>();

  _timeOptions : TimeOptionsData = undefined!;

  constructor() {
    effect(() => {
      this._timeOptions = this.timeOptions();
    });
  }

  asLocalDate(timestamp: Date){
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  asLocalTime(timestamp: Date){
    const hours = String(timestamp.getHours()).padStart(2, '0');
    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  typeChanged(key: string){
    this._timeOptions.type = key == 'departure' ? 'departure' : 'arrival';
    this.timeOptionsChange.emit(this._timeOptions);
  }

  dateChanged(result: {date: string | undefined}){
    const timestamp = this._timeOptions.timestamp;
    const hours = String(timestamp.getHours()).padStart(2, '0');
    const minutes = String(timestamp.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    this._timeOptions.timestamp = new Date(Date.parse(`${result.date}T${time}`));
    this.timeOptionsChange.emit(this._timeOptions);
  }

  timeChanged(result: {time: string | undefined}){
    const timestamp = this._timeOptions.timestamp;
    const year = timestamp.getFullYear();
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const day = String(timestamp.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    this._timeOptions.timestamp = new Date(Date.parse(`${date}T${result.time}`));
    this.timeOptionsChange.emit(this._timeOptions);
  }

  subtractOneDay(){
    this._timeOptions.timestamp.setDate(this._timeOptions.timestamp.getDate() - 1);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  addOneDay(){
    this._timeOptions.timestamp.setDate(this._timeOptions.timestamp.getDate() + 1);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  subtract15Min(){
    this._timeOptions.timestamp = new Date(this._timeOptions.timestamp.getTime() - 15 * 60000);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  add15Min(){
    this._timeOptions.timestamp = new Date(this._timeOptions.timestamp.getTime() + 15 * 60000);
    this.timeOptionsChange.emit(this._timeOptions);
  }
}
