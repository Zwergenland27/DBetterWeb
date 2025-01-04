import {Component, Input} from '@angular/core';
import {ConnectionDto, ConnectionSectionDto, ConnectionStationDto, Demand} from '../../search.service';
import {CurrencyPipe, DatePipe, NgClass} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {DemandComponent} from '../demand/demand.component';

@Component({
  selector: 'app-connection-card',
  imports: [
    DatePipe,
    MatButton,
    MatIcon,
    MatTooltip,
    DemandComponent,
    CurrencyPipe,
    NgClass,
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.css'
})
export class ConnectionCardComponent {
  @Input({required: true}) showBikeInfo!: boolean;
  @Input({required: true}) showAccessibilityInfo!: boolean;
  @Input({required: true}) requestedClass!: 'First' | 'Second';
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

  getTransferTime(firstSection : ConnectionSectionDto, secondSection : ConnectionSectionDto){
    const arrival = new Date(firstSection.stops[firstSection.stops.length - 1].arrival!);
    const departure = new Date(secondSection.stops[0].departure!);
    const difference = Math.abs(departure.getTime() - arrival.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  getSectionDuration(section: ConnectionSectionDto){
    const startTime = new Date(section.stops[0].departure!);
    const endTime = new Date(section.stops[section.stops.length - 1].arrival!);
    const difference = Math.abs(endTime.getTime() - startTime.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  };

  getDemandClass(demand: Demand){
    if(this.requestedClass == 'First'){
      return demand.firstClass.toLowerCase();
    }
    return demand.secondClass.toLowerCase();
  }
}
