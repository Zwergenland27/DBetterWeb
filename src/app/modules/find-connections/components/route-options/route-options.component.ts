import {Component, effect, input, output} from '@angular/core';
import {
  AutocompleteInputTextComponent
} from '../../../../common/autocomplete-input-text/autocomplete-input-text.component';
import {map, Observable, of} from 'rxjs';
import {NgIf} from '@angular/common';
import {SegmentOptionsComponent} from '../segment-options/segment-options.component';
import {StopoverLengthOfStayComponent} from '../stopover-length-of-stay/stopover-length-of-stay.component';
import {ConnectionService} from '../../connection.service';
import {InputNumberComponent} from '../../../../common/input-number/input-number.component';
import {RouteOptionsData, RouteOptionsStopoverData} from './route-options-data';
import {
  combineMeansOfTransport,
  MeansOfTransportParameters
} from '../../contracts/parameters/means-of-transport-parameters';
import {StopoverParameters} from '../../contracts/parameters/stopover-parameters';

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

  routeOptions = input.required<RouteOptionsData>();
  routeOptionsChange = output<RouteOptionsData>();

  _routeOptions: RouteOptionsData = undefined!;

  get allowAddingStopover(){
    if(!this._routeOptions) return false;
    return this._routeOptions.secondStopover == undefined
  }

  debounceTime = 200;

  constructor(private connectionService: ConnectionService) {
    effect(() => {
      this._routeOptions = this.routeOptions();
    });
  }

  stationAsAutoComplete(station: {id: string, name: string} | undefined) {
    if(station === undefined) {return {id: undefined, value: ''}}
    return {id: station.id, value: station.name};
  }

  searchStation = (value: string) : Observable<{id: string, value: string}[]> => {
    if(!value){
      return of([])
    }
    return this.connectionService.findStations(value).pipe(map(stations => {
      return stations.map(station => ({id: station.id, value: station.name}));
    }));
  }

  originStationSelected(result: {id: string | undefined, value: string}){
    if(result.id === undefined) {
      this._routeOptions.originStation = undefined;
    }else{
      this._routeOptions.originStation = {
        id: result.id,
        name: result.value
      };
    }

    this.optionsUpdated();
  }

  destinationStationSelected(result: {id: string | undefined, value: string}){
    if(result.id === undefined) {
      this._routeOptions.destinationStation = undefined;
    }else{
      this._routeOptions.destinationStation = {
        id: result.id,
        name: result.value
      };
    }

    this.optionsUpdated();
  }

  addFirstStopover(){
    //Add first stopover
    if(this._routeOptions.firstStopover === undefined){
      this._routeOptions.firstStopover = {
        station: undefined,
        lengthOfStay: 0,
        meansOfTransportNextSection: structuredClone(this._routeOptions.meansOfTransportFirstSection)
      };
      this.optionsUpdated();
      return;
    }

    //Add stopover before existing first stopover
    this._routeOptions.secondStopover = {
      station: structuredClone(this._routeOptions.firstStopover.station),
      lengthOfStay: this._routeOptions.firstStopover.lengthOfStay,
      meansOfTransportNextSection: structuredClone(this._routeOptions.firstStopover.meansOfTransportNextSection)
    };

    this._routeOptions.firstStopover = undefined;

    //Re-renders first component to ensure that it won't get flagged as invalid
    setTimeout(() => {
      this._routeOptions.firstStopover = {
        station: undefined,
        lengthOfStay: 0,
        meansOfTransportNextSection: structuredClone(this._routeOptions.meansOfTransportFirstSection)
      }

      this.optionsUpdated();
    });
  }

  firstStopoverStationSelected(result: {id: string | undefined, value: string}){
    if(result.id === undefined) {
      this._routeOptions.firstStopover!.station = undefined;
    }else{
      this._routeOptions.firstStopover!.station = {
        id: result.id,
        name: result.value
      };
    }

    this.optionsUpdated();
  }

  removeFirstStopover(){
    //Combine the first two allowed means of transport
    this._routeOptions.meansOfTransportFirstSection = combineMeansOfTransport(
      this._routeOptions.meansOfTransportFirstSection,
      this._routeOptions.firstStopover!.meansOfTransportNextSection!)

    //Remove first stopover, without moving the second stopover to its position
    if(this._routeOptions.secondStopover === undefined){
      this._routeOptions.firstStopover = undefined;
      this.optionsUpdated();
      return;
    }

    //Move second stopover to position of first stopover
    this._routeOptions.firstStopover = this._routeOptions.secondStopover
    this._routeOptions.secondStopover = undefined;

    this.optionsUpdated();
  }

  addSecondStopover(){
    this._routeOptions.secondStopover = {
      station: undefined,
      lengthOfStay: 0,
      meansOfTransportNextSection: structuredClone(this._routeOptions.firstStopover!.meansOfTransportNextSection!)
    };

    this.optionsUpdated();
  }

  secondStopoverStationSelected(result: {id: string | undefined, value: string}){
    if(result.id === undefined) {
      this._routeOptions.secondStopover!.station = undefined;
    }else{
      this._routeOptions.secondStopover!.station = {
        id: result.id,
        name: result.value
      };
    }

    this.optionsUpdated();
  }

  removeSecondStopover(){
    this._routeOptions.firstStopover!.meansOfTransportNextSection = combineMeansOfTransport(
      this._routeOptions.firstStopover!.meansOfTransportNextSection,
      this._routeOptions.secondStopover!.meansOfTransportNextSection
    )

    this._routeOptions.secondStopover = undefined;

    this.optionsUpdated();
  }

  maxTransfersChanged(result: {value: number | undefined, valid: boolean}) {
    this._routeOptions.maxTransfers = result.value;
    this._routeOptions.maxTransfersValid = result.valid;
    this.optionsUpdated();
  }

  minTransferTimeChanged(result: {value: number | undefined, valid: boolean}) {
    this._routeOptions.minTransferTime = result.value;
    this._routeOptions.minTransferTimeValid = result.valid;
    this.optionsUpdated();
  }

  optionsUpdated(){
    this.routeOptionsChange.emit(this._routeOptions);
  }
}
