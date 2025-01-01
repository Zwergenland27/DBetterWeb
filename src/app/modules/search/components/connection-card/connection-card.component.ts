import {Component, Input} from '@angular/core';
import {ConnectionDto} from '../../search.service';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-connection-card',
  imports: [
    DatePipe,
    MatButton,
    MatIcon,
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.css'
})
export class ConnectionCardComponent {
  @Input({required: false}) connection!: ConnectionDto;

  get startTime(){
    return new Date(this.connection.startTime);
  }

  get endTime(){
    return new Date(this.connection.endTime);
  }

  get duration(){
    const difference = Math.abs(this.endTime.getTime() - this.startTime.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  get transfers(){
    return this.connection.sections.length - 1;
  }
}
