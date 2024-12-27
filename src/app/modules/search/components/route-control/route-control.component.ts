import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {catchError, debounceTime, Observable, of, switchMap} from 'rxjs';
import {RouteDto, ViaStationDto} from '../../search.service';
import {MatIconButton} from '@angular/material/button';
import {MatChipOption, MatChipSet} from '@angular/material/chips';
import {StationDto, StationService} from '../../../station/station.service';

@Component({
  selector: 'app-route-control',
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatPrefix,
    ReactiveFormsModule,
    MatIconButton,
    MatChipSet,
    MatChipOption,
    MatSuffix
  ],
  templateUrl: './route-control.component.html',
  styleUrl: './route-control.component.css'
})
export class RouteControlComponent {
  @Input({required: true}) route! : RouteDto;
  @Output() routeChange = new EventEmitter<RouteDto>();

  originControl = new FormControl('', Validators.required);
  viaStopControls : FormControl[] = [];
  destinationControl = new FormControl('', Validators.required);

  stationSuggestions: Observable<StationDto[]>[] = []
  constructor(
    private stationService: StationService) {
    this.stationSuggestions[0] = this.originControl.valueChanges.pipe(
      debounceTime(30),
      switchMap((value) => {
        return this.stationService.getStationSuggestions(value).pipe(
          catchError(() => {
            return of(<StationDto[]>[]);
          })
        )
      })
    );

    this.stationSuggestions[1] = this.destinationControl.valueChanges.pipe(
      debounceTime(30),
      switchMap((value) => {
        return this.stationService.getStationSuggestions(value).pipe(
          catchError(() => {
            return of(<StationDto[]>[]);
          })
        )
      })
    );
  }

  toggleTransport(index: number, type: string){
    if(this.route.routeOptions[index].transports.includes(type)){
      this.route.routeOptions[index].transports = this.route.routeOptions[index].transports.filter(transport => transport !== type);
    }else{
      this.route.routeOptions[index].transports.push(type);
    }
    this.routeChange.emit(this.route);
  }

  isTransportChecked(index: number, type: string){
    return this.route.routeOptions[index].transports.includes(type);
  }

  addVia(index: number){
    const previousOptions = JSON.parse(JSON.stringify(this.route.routeOptions[index]));
    this.route.routeOptions.splice(index + 1, 0, previousOptions);
    this.viaStopControls.splice(index, 0, new FormControl('', Validators.required));
    const autoComplete = this.viaStopControls[index].valueChanges.pipe(
      debounceTime(30),
      switchMap((value) => {
        return this.stationService.getStationSuggestions(value).pipe(
          catchError(() => {
            return of(<StationDto[]>[]);
          })
        )
      })
    );
    this.stationSuggestions.splice(index + 2, 0, autoComplete);
  }

  removeVia(index: number){
    this.route.routeOptions.splice(index, 1);
    this.viaStopControls.splice(index - 1, 1);
    this.stationSuggestions.splice(index + 1, 1);
    this.route.via.splice(index, 1);
    this.route.routeOptions.splice(index, 1);
    this.routeChange.emit(this.route);
  }

  originSelected(station: StationDto){
    this.route.origin = station;
    this.routeChange.emit(this.route);
  }

  viaSelected(index: number, station: StationDto){
    const currentViaStops = this.route.via;
    const changedVia = <ViaStationDto> {
      id: station.id,
      name: station.name,
      rl100: station.rl100,
      residenceMinutes: 0
    }
    if(currentViaStops[index]){
      currentViaStops[index] = changedVia;
    }else{
      currentViaStops.splice(index, 0, changedVia);
    }
  }

  destinationSelected(station: StationDto){
    this.route.destination = station;
    this.routeChange.emit(this.route);
  }
}
