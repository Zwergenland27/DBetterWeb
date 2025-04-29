import { Component } from '@angular/core';
import {RouteOptionsComponent} from './components/route-options/route-options.component';
import {ExpansionPanelComponent} from './components/expansion-panel/expansion-panel.component';
import {TimeOptionsComponent} from './components/time-options/time-options.component';
import {PassengerOptionsComponent} from './components/passenger-options/passenger-options.component';
import {FloatingButtonComponent} from '../../common/floating-button/floating-button.component';
import {IconComponent} from '../../common/icon/icon.component';
import {ConnectionsData} from './connections-data';
import {ConnectionService} from './connection.service';
import {StopoverParameters} from './contracts/parameters/stopover-parameters';
import {ConnectionDto} from './contracts/dtos/connection.dto';
import {ConnectionCardComponent} from './components/connection-card/connection-card.component';
import {NgForOf} from '@angular/common';
import {RouteOptionsData} from './components/route-options/route-options-data';
import {TimeOptionsData} from './components/time-options/time-options-data';

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
    NgForOf
  ],
  templateUrl: './find-connections.component.html',
  styleUrl: './find-connections.component.scss'
})
export class FindConnectionsComponent {
  editMode = true;

  connectionOptions: ConnectionsData;
  connections : ConnectionDto[] = [];

  constructor(private connectionService: ConnectionService) {
    this.connectionOptions = connectionService.loadConnectionsData();

    this.connections = JSON.parse(sessionStorage.getItem("data")!);
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

  test(){
    const options = this.connectionOptions;

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

    this.connectionService.getSuggestions({
      departureTime: options.time.type === 'departure' ? options.time.timestamp.toISOString() : undefined,
      arrivalTime: options.time.type === 'arrival' ? options.time.timestamp.toISOString() : undefined,
      passengers: [],
      route: {
        originStationId: options.route.originStation.id,
        meansOfTransportFirstSection: options.route.meansOfTransportFirstSection,
        firstStopover: firstStopover,
        secondStopover: secondStopover,
        destinationStationId: options.route.destinationStation.id,
        maxTransfers: options.route.maxTransfers!,
        minTransferTime: options.route.minTransferTime!,
      },
      comfortClass: 'Second'
    }).subscribe(value => {
      this.connections = value.connections;
      sessionStorage.setItem('data', JSON.stringify(this.connections));
    });
  }
}
