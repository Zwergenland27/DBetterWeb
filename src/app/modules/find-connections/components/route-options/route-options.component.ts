import { Component } from '@angular/core';
import {
  AutocompleteInputTextComponent
} from '../../../../common/autocomplete-input-text/autocomplete-input-text.component';
import {map, Observable, of} from 'rxjs';
import {NgIf} from '@angular/common';
import {SegmentOptionsComponent} from '../segment-options/segment-options.component';
import {StopoverLengthOfStayComponent} from '../stopover-length-of-stay/stopover-length-of-stay.component';
import {ConnectionService} from '../../connection.service';

@Component({
  selector: 'route-options',
  imports: [
    AutocompleteInputTextComponent,
    NgIf,
    SegmentOptionsComponent,
    StopoverLengthOfStayComponent
  ],
  templateUrl: './route-options.component.html',
  styleUrl: './route-options.component.scss'
})
export class RouteOptionsComponent {
  originStationId: string | undefined = undefined;
  showFirstStopoverInput = false;
  firstStopover: {id: string | undefined, name: string, stayTotalMinutes: number} = {id: undefined, name: '', stayTotalMinutes: 0};
  showSecondStopoverInput = false;
  secondStopover: {id: string | undefined, name: string, stayTotalMinutes: number} = {id: undefined, name: '', stayTotalMinutes: 0};
  destinationStationId: string | undefined = undefined;


  constructor(private connectionService: ConnectionService) {
  }

  stopoverAsResult(stopover: {id: string | undefined, name: string}){
    return {id: stopover.id, value: stopover.name};
  }

  searchStation = (value: string) : Observable<{id: string, value: string}[]> => {
    return this.connectionService.findStations(value).pipe(map(stations => {
      return stations.map(station => ({id: station.id, value: station.name}));
    }));
  }

  originStationSelected(result: {id: string | undefined}){
    this.originStationId = result.id;
  }


  destinationStationSelected(result: {id: string | undefined}){
    this.destinationStationId = result.id;
  }

  addFirstStopover(){
    if(!this.showFirstStopoverInput){
      this.showFirstStopoverInput = true;
      return;
    }

    this.secondStopover.id = this.firstStopover.id;
    this.secondStopover.name = this.firstStopover.name;
    this.secondStopover.stayTotalMinutes = this.firstStopover.stayTotalMinutes;

    this.firstStopover.id = undefined;
    this.firstStopover.name = '';
    this.firstStopover.stayTotalMinutes = 0;

    //Re-renders first component to ensure that it won't get flagged as invalid
    this.showFirstStopoverInput = false;
    setTimeout(() => this.showFirstStopoverInput = true);

    this.showSecondStopoverInput = true;
  }

  firstStopoverStationSelected(result: {id: string | undefined, value: string}){
    this.firstStopover.id = result.id;
    this.firstStopover.name = result.value;
  }

  removeFirstStopover(){
    if(!this.showSecondStopoverInput){
      this.firstStopover.id = undefined;
      this.firstStopover.name = '';

      this.showFirstStopoverInput = false;
    }

    this.firstStopover.id = this.secondStopover.id;
    this.firstStopover.name = this.secondStopover.name;
    this.firstStopover.stayTotalMinutes = this.secondStopover.stayTotalMinutes;

    this.secondStopover.id = undefined;
    this.secondStopover.name = '';
    this.secondStopover.stayTotalMinutes = 0;

    this.showSecondStopoverInput = false;
  }

  addSecondStopover(){
    this.showSecondStopoverInput = true;
  }

  secondStopoverStationSelected(result: {id: string | undefined, value: string}){
    this.secondStopover.id = result.id;
    this.secondStopover.name = result.value;
  }

  removeSecondStopover(){
    this.secondStopover.id = undefined;
    this.secondStopover.name = '';
    this.showSecondStopoverInput = false;
  }
}
