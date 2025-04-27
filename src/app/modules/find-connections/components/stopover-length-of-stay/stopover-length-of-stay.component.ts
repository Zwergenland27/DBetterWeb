import {Component, effect, input, output} from '@angular/core';
import {IconButtonMiniComponent} from '../../../../common/icon-button-mini/icon-button-mini.component';
import {IconComponent} from '../../../../common/icon/icon.component';
import {NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';

@Component({
  selector: 'stopover-length-of-stay',
  imports: [
    IconButtonMiniComponent,
    IconComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './stopover-length-of-stay.component.html',
  styleUrl: './stopover-length-of-stay.component.scss'
})
export class StopoverLengthOfStayComponent {
  totalMinutes = input.required<number>();
  totalMinutesChange = output<number>();

  hours = 0;
  minutes = 0;

  _id = crypto.randomUUID();
  hoursInputId = 'hoursInput-' + this._id;
  minutesInputId = 'minutesInput-' + this._id;


  withLeadingZero(value: number){
    return value.toString().padStart(2, '0');
  }

  constructor() {
    effect(() => {
      this.hours = Math.floor(this.totalMinutes() / 60);
      this.minutes = this.totalMinutes() % 60;
    });
  }

  beforeHoursInput(event: InputEvent) {
    if(!event.data) return;

    const number = Number(event.data);

    if(isNaN(number)){
      event.preventDefault();
      return;
    }

    const newValue = `${this.hours}${number}`;
    if(Number(newValue) > 99) {
      this.hours = Number(this.hours.toString()[1]);
    }
  }

  beforeMinutesInput(event: InputEvent) {
    if(!event.data) return;

    const number = Number(event.data);

    if(isNaN(number)){
      event.preventDefault();
      return;
    }

    const newValue = `${this.minutes}${number}`;
    if(Number(newValue) > 59) {
      this.minutes = Number(this.minutes.toString()[1]);
    }
  }

  onHoursInput(value: string, minutesInput: HTMLElement){
    this.hours = Number(value);
    if(this.hours.toString().length == 2){
      minutesInput.focus();
    }
    this.emitTotalValue()
  }

  onMinutesInput(value: string, minutesInput: HTMLElement){
    this.minutes = Number(value);
    if(this.minutes.toString().length == 2){
      minutesInput.blur();
    }
    this.emitTotalValue()
  }

  emitTotalValue(){
    const totalMinutes = this.hours * 60 + this.minutes;
    this.totalMinutesChange.emit(totalMinutes);
  }

  get additionAllowed(){
    return this.hours < 99 || this.minutes < 45;
  }

  add15Min(){
    if(!this.additionAllowed) return;
    this.minutes += 15
    if(this.minutes >= 60){
      this.hours++;
      this.minutes -= 60;
    }
    this.emitTotalValue();
  }

  get subtractionAllowed(){
    return this.hours > 0 || this.minutes >= 15;
  }

  subtract15Min(){
    if(!this.subtractionAllowed) return;
    this.minutes -= 15
    if(this.minutes < 0){
      this.hours--;
      this.minutes += 60;
    }
    this.emitTotalValue();
  }
}
