import { Component, input } from '@angular/core';
import { Connection, ConnectionDto } from '../../contracts/dtos/connection';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {Segment, SegmentDto, TransferSegment, TransportSegment, WalkingSegment} from '../../contracts/dtos/segment';
import {IconComponent} from '../../../../common/icon/icon.component';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';
import {SegmentComponent} from '../segment/segment.component';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';
import {connect} from 'rxjs';

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
  connection = input.required<Connection>();
  comfortClass = input.required<ComfortClass>();

  constructor(private datePipe: DatePipe) {
  }

  isTransferSegment(segment: Segment) {
    return segment instanceof TransferSegment;
  }

  isWalkingSegment(segment: Segment) {
    return segment instanceof WalkingSegment;
  }

  isTransportSegment(segment: Segment) {
    return segment instanceof TransportSegment;
  }

  asTransportSegment(segment: Segment) {
    return segment as TransportSegment;
  }

  get plannedTimeInformation(){
    return {
      departure: this.connection().departureTime.planned,
      arrival: this.connection().arrivalTime.planned,
    }
  }

  get realTimeInformation() {
    const departure = this.connection().departureTime;
    const arrival = this.connection().arrivalTime;

    if(!departure.real && !arrival.real) return null;

    return {
      departure: departure.real ?? departure.planned,
      departureTimingType: departure.getDelayInformation(),
      arrival: arrival.real ?? arrival.planned,
      arrivalTimingType: arrival.getDelayInformation()
    }
  }

  openOnBahnDe(){
    console.log(this.connection().bahnDeUrl);
    window.open(this.connection().bahnDeUrl, "_blank");
  }

  toggleDetails(){
    this.detailsOpened = !this.detailsOpened;
  }
}
