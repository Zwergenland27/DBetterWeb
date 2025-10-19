import {Component} from '@angular/core';
import {RouteOptionsComponent} from './components/route-options/route-options.component';
import {ExpansionPanelComponent} from './components/expansion-panel/expansion-panel.component';
import {TimeOptionsComponent} from './components/time-options/time-options.component';
import {PassengerOptionsComponent} from './components/passenger-options/passenger-options.component';
import {FloatingButtonComponent} from '../../common/floating-button/floating-button.component';
import {IconComponent} from '../../common/icon/icon.component';
import {ConnectionsData} from './connections-data';
import {ConnectionService} from './connection.service';
import {StopoverParameters} from './contracts/parameters/stopover-parameters';
import {Connection} from './contracts/dtos/connection';
import {ConnectionCardComponent} from './components/connection-card/connection-card.component';
import { DatePipe } from '@angular/common';
import {RouteOptionsData} from './components/route-options/route-options-data';
import {TimeOptionsData} from './components/time-options/time-options-data';
import {ComfortClass} from '../../common/contracts/dtos/comfort-class';
import {
  Discount,
  DiscountType, mapToPassengerParameter,
  PassengerOptionsData,
  SelectableDiscountClass
} from './components/passenger-options/passenger-options-data';

@Component({
  selector: 'app-find-connections',
  imports: [
    RouteOptionsComponent,
    ExpansionPanelComponent,
    TimeOptionsComponent,
    PassengerOptionsComponent,
    FloatingButtonComponent,
    IconComponent,
    ConnectionCardComponent,
    DatePipe
],
  templateUrl: './find-connections.component.html',
  styleUrl: './find-connections.component.scss'
})
export class FindConnectionsComponent {
  private REQUESTED_KEY = 'requested';

  editMode = true;

  requestId = ''
  loadingEarlier = false;
  pageEarlier: string | null = null;
  loading = false;
  pageLater: string | null = null;
  loadingLater = false;

  connectionOptions: ConnectionsData;
  connections : Connection[] = [];

  constructor(private connectionService: ConnectionService) {
    this.connectionOptions = connectionService.loadConnectionsData();
    if(sessionStorage.getItem(this.REQUESTED_KEY) === "true"){
      this.startSearch();
    }
  }

  close(){
    this.editMode = false;
  }

  open(){
    this.editMode = true;
  }

  routeChanged(options: RouteOptionsData){
    this.connectionOptions.route = options;
    this.connectionService.storeConnectionsData(this.connectionOptions);
  }

  timeChanged(options: TimeOptionsData){
    this.connectionOptions.time = options;
    this.connectionService.storeConnectionsData(this.connectionOptions);
  }

  passengersChanged(passengers: PassengerOptionsData[]){
    this.connectionOptions.passengers = passengers;
    this.connectionService.storeConnectionsData(this.connectionOptions);
  }

  displayDate(i: number){
    if (i === 0) return true;

    const previousConnectionDeparture = this.connections[i - 1].departureTime.planned.getDate();
    const connectionDeparture = this.connections[i].departureTime.planned.getDate();
    return previousConnectionDeparture != connectionDeparture;
  }

  loadEarlier(){
    this.loadingEarlier = true;
    this.connectionService.getSuggestions(
      this.requestId,
      this.pageEarlier,
    ).subscribe({
      next: value => {
        this.loadingEarlier = false;
        this.pageEarlier = value.pageEarlier;
        this.connections = value.connections.concat(this.connections);
      },
      error: error => {
        window.alert(error.message);
        this.loadingEarlier = false;
      }
    });
  }

  startSearch(){
    const options = this.connectionOptions;

    //TODO: validate options and highlight all invalid fields

    if(options.route.originStation === undefined || options.route.destinationStation === undefined){
      throw new Error('Origin and destination station is missing');
    }

    let firstStopover: StopoverParameters | undefined = undefined;
    let secondStopover: StopoverParameters | undefined = undefined;

    if(options.route.firstStopover != undefined){
      if(options.route.firstStopover.station === undefined){
        throw new Error('First stopover station missing');
      }
      firstStopover = {
        stationId: options.route.firstStopover.station.id,
        lengthOfStay: options.route.firstStopover.lengthOfStay,
        meansOfTransportNextSection: options.route.firstStopover.meansOfTransportNextSection
      }
    }

    if(options.route.secondStopover != undefined){
      if(options.route.secondStopover.station === undefined){
        throw new Error('Second stopover station missing');
      }
      secondStopover = {
        stationId: options.route.secondStopover.station.id,
        lengthOfStay: options.route.secondStopover.lengthOfStay,
        meansOfTransportNextSection: options.route.secondStopover.meansOfTransportNextSection
      }
    }

    if(options.time.timestamp === undefined){
      throw new Error('Time timestamp is missing');
    }

    this.connections = [];
    this.loading = true;
    if(window.innerWidth <= 768){
      this.editMode = false;
    }

    sessionStorage.setItem(this.REQUESTED_KEY, "true");
    this.connectionService.createRequest({
      departureTime: options.time.type === 'departure' ? options.time.timestamp.toISOString() : undefined,
      arrivalTime: options.time.type === 'arrival' ? options.time.timestamp.toISOString() : undefined,
      passengers: options.passengers.map(mapToPassengerParameter),
      route: {
        originStationId: options.route.originStation.id,
        meansOfTransportFirstSection: options.route.meansOfTransportFirstSection,
        firstStopover: firstStopover,
        secondStopover: secondStopover,
        destinationStationId: options.route.destinationStation.id,
        maxTransfers: options.route.maxTransfers!,
        minTransferTime: options.route.minTransferTime!,
      },
      comfortClass: options.comfortClass
    })
      .subscribe(
        {
          next: value => {
            this.loading = false;
            this.requestId = value.requestId;
            this.pageEarlier = value.pageEarlier;
            this.connections = value.connections;
            this.pageLater = value.pageLater;
          },
          error: error => {
            window.alert(error.message);
            this.loading = false;
          },
        }
      );
  }

  loadLater() {
    this.loadingLater = true;
    this.connectionService.getSuggestions(
      this.requestId,
      this.pageLater,
    ).subscribe({
      next: value => {
        this.loadingLater = false;
        this.pageLater = value.pageLater;
        this.connections = this.connections.concat(value.connections);
      },
      error: error => {
        window.alert(error.message);
        this.loadingLater = false;
      }
    });
  }

  comfortClassChanged(comfortClass: ComfortClass) {
    this.connectionOptions.comfortClass = comfortClass;
    this.connectionService.storeConnectionsData(this.connectionOptions);
  }
}
