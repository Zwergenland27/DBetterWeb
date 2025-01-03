import {Component, Input} from '@angular/core';
import {ConnectionDto, Demand} from '../../search.service';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-connection-card',
  imports: [
    DatePipe,
    MatButton,
    MatIcon,
    MatTooltip,
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.css'
})
export class ConnectionCardComponent {
  @Input({required: true}) showBikeInfo!: boolean;
  @Input({required: true}) showAccessibilityInfo!: boolean;
  @Input({required: false}) connection!: ConnectionDto;

  expanded = false;

  get startTime(){
    const section = this.connection.sections[0];
    return new Date(section.stops[0].departure!);
  }

  get endTime(){
    const section = this.connection.sections[this.connection.sections.length - 1];
    return new Date(section.stops[section.stops.length - 1].arrival!);
  }

  getSectionInfos(i: number){
    return this.connection.sections[i].information.filter(info => info.priority > 1);
  }

  getConnectionInfos(){
    return this.connection.information.filter(info => info.priority > 1);
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

  togglePanel(){
    this.expanded = !this.expanded
  }

  protected readonly Demand = Demand;
}
