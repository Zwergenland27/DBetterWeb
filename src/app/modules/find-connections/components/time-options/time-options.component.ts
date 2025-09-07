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

  options = [
    {key: 'departure', label: $localize`:@@Departure:Departure`,},
    {key: 'arrival', label: $localize`:@@Arrival:Arrival`,},
  ];

  timeOptions = input.required<TimeOptionsData>();
  timeOptionsChange = output<TimeOptionsData>();

  date = "";
  time = "";

  _timeOptions : TimeOptionsData = undefined!;

  constructor() {
    effect(() => {
      this._timeOptions = this.timeOptions();

      if(this._timeOptions.timestamp) {
        this.date = this.asLocalDate(this._timeOptions.timestamp);
        this.time = this.asLocalTime(this._timeOptions.timestamp);
      }
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

  dateChanged(result: {date: string, valid: boolean}) {
    this.date = result.date;

    if(result.valid){
      this._timeOptions.timestamp = new Date(Date.parse(`${this.date}T${this.time}`));
    }else{
      this._timeOptions.timestamp = undefined;
    }

    this.timeOptionsChange.emit(this._timeOptions);
  }

  timeChanged(result: {time: string, valid: boolean}) {
    this.time = result.time;

    if(result.valid){
      this._timeOptions.timestamp = new Date(Date.parse(`${this.date}T${this.time}`));
    }else{
      this._timeOptions.timestamp = undefined;
    }

    this.timeOptionsChange.emit(this._timeOptions);
  }

  subtractOneDay(){
    if(!this._timeOptions.timestamp){
      return;
    }

    this._timeOptions.timestamp.setDate(this._timeOptions.timestamp.getDate() - 1);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  addOneDay(){
    if(!this._timeOptions.timestamp){
      return;
    }

    this._timeOptions.timestamp.setDate(this._timeOptions.timestamp.getDate() + 1);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  subtract15Min(){
    if(!this._timeOptions.timestamp){
      return;
    }
    this._timeOptions.timestamp = new Date(this._timeOptions.timestamp.getTime() - 15 * 60000);
    this.timeOptionsChange.emit(this._timeOptions);
  }

  add15Min(){
    if(!this._timeOptions.timestamp){
      return;
    }
    this._timeOptions.timestamp = new Date(this._timeOptions.timestamp.getTime() + 15 * 60000);
    this.timeOptionsChange.emit(this._timeOptions);
  }
}
