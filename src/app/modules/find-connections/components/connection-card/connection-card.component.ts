import { Component, input } from '@angular/core';
import { ConnectionDto } from '../../contracts/dtos/connection.dto';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {getIconName, TransportSegmentDto} from '../../contracts/dtos/transport-segment.dto';
import {SegmentDto} from '../../contracts/dtos/segment.dto';
import {IconComponent} from '../../../../common/icon/icon.component';
import {getShortCurrency} from '../../contracts/dtos/offer.dto';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';
import {SegmentComponent} from '../segment/segment.component';

@Component({
  selector: 'connection-card',
  imports: [
    DatePipe,
    NgIf,
    NgClass,
    IconComponent,
    CurrencyPipe,
    FloatingButtonComponent,
    SegmentComponent
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.scss'
})
export class ConnectionCardComponent {
  detailsOpened = false;
  connection = input.required<ConnectionDto>();

  constructor(private datePipe: DatePipe) {
  }

  get plannedDepartureTime() {
    const segments = this.connection().segments;
    return segments[0].departureTime.planned;
  }

  get realDepartureTime() {
    const segments = this.connection().segments;
    const planned = segments[0].departureTime.planned;
    const real = segments[0].departureTime.real;

    if(real === null){
      return {
        type: 'no-data',
        time: planned
      }
    }

    const delayed = Date.parse(planned) < Date.parse(real);

    return {
      type: delayed ? 'delayed' : 'on-time',
      time: real
    }
  }

  get plannedArrivalTime() {
    const segments = this.connection().segments;
    return segments[segments.length - 1].arrivalTime.planned;
  }

  get realArrivalTime() {
    const segments = this.connection().segments;

    const planned = segments[segments.length - 1].arrivalTime.planned;
    const real = segments[segments.length - 1].arrivalTime.real;

    if(real === null){
      return {
        type: 'no-data',
        time: planned
      }
    }

    const delayed = Date.parse(planned) < Date.parse(real);

    return {
      type: delayed ? 'delayed' : 'on-time',
      time: real
    }
  }

  get realDuration() {
    const departure = this.realDepartureTime;
    const arrival = this.realArrivalTime;

    return this.getHoursAndMinutesBetweenDates(departure.time, arrival.time);
  }

  asTransportSegment(segment: SegmentDto) {
    return segment as TransportSegmentDto;
  }

  get transferCount(){
    return this.connection().segments.filter(segment => segment.$type === 'transport').length - 1;
  }

  getPercentage(segment: SegmentDto) {
    const totalDeparture = this.connection().segments[0].departureTime.planned;
    const totalArrival = this.connection().segments[this.connection().segments.length - 1].arrivalTime.planned;
    const totalDuration = Math.abs(Date.parse(totalArrival) - Date.parse(totalDeparture));

    const plannedDeparture = segment.departureTime.planned;
    const plannedArrival = segment.arrivalTime.planned;
    const plannedDuration = Math.abs(Date.parse(plannedArrival) - Date.parse(plannedDeparture));

    return (plannedDuration / totalDuration) * 100;
  }

  getTransferPercentage(fromSegment: SegmentDto, toSegment: SegmentDto) {
    const totalDeparture = this.connection().segments[0].departureTime.planned;
    const totalArrival = this.connection().segments[this.connection().segments.length - 1].arrivalTime.planned;
    const totalDuration = Math.abs(Date.parse(totalArrival) - Date.parse(totalDeparture));

    const plannedDeparture = fromSegment.arrivalTime.planned;
    const plannedArrival = toSegment.departureTime.planned;
    const plannedDuration = Math.abs(Date.parse(plannedArrival) - Date.parse(plannedDeparture));

    return (plannedDuration / totalDuration) * 100;
  }

  getHoursAndMinutesBetweenDates(date1: string, date2: string){
    let difference = Date.parse(date2) - Date.parse(date1);
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  getTransferTime(index: number){
    const segments = this.connection().segments;
    if(index >= segments.length - 1) return undefined;
    const fromSegment = segments[index];

    if(fromSegment.$type === 'walking'){
      const realTransferTime = this.getHoursAndMinutesBetweenDates(fromSegment.departureTime.real ?? fromSegment.departureTime.planned, fromSegment.arrivalTime.real ?? fromSegment.arrivalTime.planned);
      if(realTransferTime.hours > 0){
        return `${realTransferTime.hours}h ${realTransferTime.minutes}min`;
      }

      return `${realTransferTime.minutes}min`;
    }

    const toSegment = segments[index + 1];

    if(fromSegment.$type === 'transport' && toSegment.$type === 'transport'){
      const realTransferTime = this.getHoursAndMinutesBetweenDates(fromSegment.arrivalTime.real ?? fromSegment.arrivalTime.planned, toSegment.departureTime.real ?? toSegment.departureTime.planned);
      if(realTransferTime.hours > 0){
        return `${realTransferTime.hours}h ${realTransferTime.minutes}min`;
      }

      return `${realTransferTime.minutes}min`;
    }

    return undefined;
  }

  openOnBahnDe(){
    console.log(this.connection().bahnDeUrl);
    window.open(this.connection().bahnDeUrl, "_blank");
  }

  toggleDetails(){
    this.detailsOpened = !this.detailsOpened;
  }

  protected readonly getShortCurrency = getShortCurrency;
  protected readonly getIconName = getIconName;
}
