import { Component, input } from '@angular/core';
import { ConnectionDto } from '../../contracts/dtos/connection.dto';
import {connect} from 'rxjs';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {TransportSegmentDto} from '../../contracts/dtos/transport-segment.dto';
import {SegmentDto} from '../../contracts/dtos/segment.dto';
import {getShortName} from '../../../../common/contracts/dtos/transport-product';
import {DemandDto} from '../../../../common/contracts/dtos/demand.dto';
import {TravelTime} from '../../../../common/contracts/dtos/travel-time.dto';

@Component({
  selector: 'connection-card',
  imports: [
    DatePipe,
    NgIf,
    NgClass
  ],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.scss'
})
export class ConnectionCardComponent {
  connection = input.required<ConnectionDto>();
  protected readonly connect = connect;

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

    const difference = Math.abs(Date.parse(arrival.time) - Date.parse(departure.time));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  asTransportSegment(segment: SegmentDto) {
    return segment as TransportSegmentDto;
  }

  get transferCount(){
    return this.connection().segments.filter(segment => segment.$type === 'transport').length - 1;
  }

  get timegraph() : {
    plannedPercentage: number,
    realPercentage: number,
    demand: DemandDto | undefined}[] {
    const graphSections: {plannedPercentage: number, realPercentage: number, demand: DemandDto | undefined}[] = [];

    const segments = this.connection().segments;
    const totalDuration = this.getDuration(
      segments[0].departureTime,
      segments[segments.length - 1].arrivalTime);

    for(let i = 0; i < segments.length; i++){
      const segment = segments[i];
      const duration = this.getDuration(segment.departureTime, segment.arrivalTime);
      let demand: DemandDto | undefined = undefined;

      if(segment.$type === 'transport'){
        demand = (segment as TransportSegmentDto).demand;
      }

      graphSections.push({
        plannedPercentage: +(duration.plannedDuration / totalDuration.plannedDuration).toFixed(2) * 100,
        realPercentage: +(duration.realDuration / totalDuration.realDuration).toFixed(2) * 100,
        demand: demand
      });

      if(i < segments.length - 1){
        const transferDuration = this.getDuration(segment.arrivalTime, segments[i+1].departureTime);
        graphSections.push({
          plannedPercentage: +(transferDuration.plannedDuration / totalDuration.plannedDuration).toFixed(2) * 100,
          realPercentage: +(transferDuration.realDuration / totalDuration.realDuration).toFixed(2) * 100,
          demand: undefined
        })
      }
    }

    return graphSections;
  }

  getDuration(departure: TravelTime, arrival: TravelTime){
    const plannedDeparture = departure.planned;
    const plannedArrival = arrival.planned;
    const plannedDuration = Math.abs(Date.parse(plannedArrival) - Date.parse(plannedDeparture));


    const realDeparture = departure.real ?? departure.planned;
    const realArrival = arrival.real ?? arrival.planned;
    const realDuration = Math.abs(Date.parse(realDeparture) - Date.parse(realArrival));
    return {
      plannedDuration: plannedDuration,
      realDuration: realDuration
    }
  }

  protected readonly getShortName = getShortName;
}
