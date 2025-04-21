import {Component, effect, input} from '@angular/core';
import {
  AutocompleteInputTextComponent
} from '../../../../common/autocomplete-input-text/autocomplete-input-text.component';
import {map, Observable, of} from 'rxjs';
import {NgIf} from '@angular/common';
import {SegmentOptionsComponent} from '../segment-options/segment-options.component';
import {StopoverLengthOfStayComponent} from '../stopover-length-of-stay/stopover-length-of-stay.component';
import {ConnectionService} from '../../connection.service';
import {
  getMeansOfTransportDefault,
} from '../../contracts/parameters/means-of-transport-parameters';
import {InputNumberComponent} from '../../../../common/input-number/input-number.component';
import {RouteParameters} from '../../contracts/parameters/route-parameters';

@Component({
  selector: 'route-options',
  imports: [
    AutocompleteInputTextComponent,
    NgIf,
    SegmentOptionsComponent,
    StopoverLengthOfStayComponent,
    InputNumberComponent,
  ],
  templateUrl: './route-options.component.html',
  styleUrl: './route-options.component.scss'
})
export class RouteOptionsComponent {

  routeOptions = input<RouteParameters>();

  originStationId: string | undefined = undefined;
  firstSectionAllowedMeansOfTransport = getMeansOfTransportDefault();
  showFirstStopoverInput = false;
  firstStopover: {id: string | undefined, name: string, stayTotalMinutes: number} = {id: undefined, name: '', stayTotalMinutes: 0};
  secondSectionAllowedMeansOfTransport = getMeansOfTransportDefault();
  showSecondStopoverInput = false;
  secondStopover: {id: string | undefined, name: string, stayTotalMinutes: number} = {id: undefined, name: '', stayTotalMinutes: 0};
  thirdSectionAllowedMeansOfTransport = getMeansOfTransportDefault();
  destinationStationId: string | undefined = undefined;
  minTransferMinutes = 0;
  maxTransfers = 10;

  debounceTime = 200;

  constructor(private connectionService: ConnectionService) {
  }

  stopoverAsResult(stopover: {id: string | undefined, name: string}){
    return {id: stopover.id, value: stopover.name};
  }

  searchStation = (value: string) : Observable<{id: string, value: string}[]> => {
    if(!value){
      return of([])
    }
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
      this.secondSectionAllowedMeansOfTransport = structuredClone(this.firstSectionAllowedMeansOfTransport);
      return;
    }

    this.secondStopover.id = this.firstStopover.id;
    this.secondStopover.name = this.firstStopover.name;
    this.secondStopover.stayTotalMinutes = this.firstStopover.stayTotalMinutes;
    this.thirdSectionAllowedMeansOfTransport = structuredClone(this.secondSectionAllowedMeansOfTransport);
    this.secondSectionAllowedMeansOfTransport = structuredClone(this.firstSectionAllowedMeansOfTransport);

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
    this.firstSectionAllowedMeansOfTransport = {
      highSpeedTrains: this.firstSectionAllowedMeansOfTransport.highSpeedTrains || this.secondSectionAllowedMeansOfTransport.highSpeedTrains,
      fastTrains: this.firstSectionAllowedMeansOfTransport.fastTrains || this.secondSectionAllowedMeansOfTransport.fastTrains,
      regionalTrains: this.firstSectionAllowedMeansOfTransport.regionalTrains || this.secondSectionAllowedMeansOfTransport.regionalTrains,
      suburbanTrains: this.firstSectionAllowedMeansOfTransport.suburbanTrains || this.secondSectionAllowedMeansOfTransport.suburbanTrains,
      undergrounds: this.firstSectionAllowedMeansOfTransport.undergrounds || this.secondSectionAllowedMeansOfTransport.undergrounds,
      trams: this.firstSectionAllowedMeansOfTransport.trams || this.secondSectionAllowedMeansOfTransport.trams,
      busses: this.firstSectionAllowedMeansOfTransport.busses || this.secondSectionAllowedMeansOfTransport.busses,
      boats: this.firstSectionAllowedMeansOfTransport.boats || this.secondSectionAllowedMeansOfTransport.boats,
    }

    this.secondStopover.id = undefined;
    this.secondStopover.name = '';
    this.secondStopover.stayTotalMinutes = 0;

    this.showSecondStopoverInput = false;
  }

  addSecondStopover(){
    this.showSecondStopoverInput = true;
    this.thirdSectionAllowedMeansOfTransport = structuredClone(this.firstSectionAllowedMeansOfTransport);
  }

  secondStopoverStationSelected(result: {id: string | undefined, value: string}){
    this.secondStopover.id = result.id;
    this.secondStopover.name = result.value;
  }

  removeSecondStopover(){
    this.secondStopover.id = undefined;
    this.secondStopover.name = '';
    this.showSecondStopoverInput = false;

    this.secondSectionAllowedMeansOfTransport = {
      highSpeedTrains: this.secondSectionAllowedMeansOfTransport.highSpeedTrains || this.thirdSectionAllowedMeansOfTransport.highSpeedTrains,
      fastTrains: this.secondSectionAllowedMeansOfTransport.fastTrains || this.thirdSectionAllowedMeansOfTransport.fastTrains,
      regionalTrains: this.secondSectionAllowedMeansOfTransport.regionalTrains || this.thirdSectionAllowedMeansOfTransport.regionalTrains,
      suburbanTrains: this.secondSectionAllowedMeansOfTransport.suburbanTrains || this.thirdSectionAllowedMeansOfTransport.suburbanTrains,
      undergrounds: this.secondSectionAllowedMeansOfTransport.undergrounds || this.thirdSectionAllowedMeansOfTransport.undergrounds,
      trams: this.secondSectionAllowedMeansOfTransport.trams || this.thirdSectionAllowedMeansOfTransport.trams,
      busses: this.secondSectionAllowedMeansOfTransport.busses || this.thirdSectionAllowedMeansOfTransport.busses,
      boats: this.secondSectionAllowedMeansOfTransport.boats || this.thirdSectionAllowedMeansOfTransport.boats,
    }
  }
}
