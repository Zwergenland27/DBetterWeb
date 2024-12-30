import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {catchError, debounceTime, Observable, of, switchMap} from 'rxjs';
import { RouteDto, ViaStationDto} from '../../search.service';
import {MatIconButton} from '@angular/material/button';
import {MatChipOption, MatChipSet} from '@angular/material/chips';
import {StationDto, StationService} from '../../../station/station.service';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

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
    MatSuffix,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './route-control.component.html',
  styleUrls: ['./route-control.component.css', '../../search.component.css']
})
export class RouteControlComponent {
  @Input({required: true}) route! : RouteDto;
  @Input() valid : boolean = false;
  @Output() validChange = new EventEmitter<boolean>();

  originControl = new FormControl('', Validators.required);
  viaStopControls : FormControl[] = [];
  viaResidenceControls : FormControl[] = [];
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
    const routeOptions = this.route.routeOptions[index];
    switch (type){
      case 'ice': routeOptions.allowHighSpeedTrains = !routeOptions.allowHighSpeedTrains; break;
      case 'ic': routeOptions.allowIntercityTrains = !routeOptions.allowIntercityTrains; break;
      case 'regional': routeOptions.allowRegionalTrains = !routeOptions.allowRegionalTrains; break;
      case 'local': routeOptions.allowPublicTransport = !routeOptions.allowPublicTransport; break;
    }

    this.route.routeOptions[index] = routeOptions;
  }

  isTransportChecked(index: number, type: string){
    const routeOptions = this.route.routeOptions[index];
    switch (type){
      case 'ice': return routeOptions.allowHighSpeedTrains;
      case 'ic': return routeOptions.allowIntercityTrains;
      case 'regional': return routeOptions.allowRegionalTrains;
      case 'local': return routeOptions.allowPublicTransport;
      default: return false;
    }
  }

  addVia(index: number){
    const previousOptions = JSON.parse(JSON.stringify(this.route.routeOptions[index]));
    this.route.routeOptions.splice(index + 1, 0, previousOptions);

    const addedVia = <ViaStationDto> {
      id: null,
      name: null,
      residence: 0
    }
    this.viaStopControls.splice(index, 0, new FormControl('', Validators.required));
    const residenceControl = new FormControl('00:00', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]);
    residenceControl.statusChanges.subscribe((status) => {
      if(status == 'VALID'){
        const currentIndex = this.viaResidenceControls.findIndex(control => control == residenceControl);
        const [minutes, seconds] = residenceControl.value!.split(':').map(Number);
        this.route.via[currentIndex].residence = minutes * 60 + seconds;
      }
      this.updateValidity();
    })
    this.viaResidenceControls.splice(index, 0, residenceControl);
    this.route.via.splice(index, 0, addedVia);

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
    this.updateValidity();
  }

  removeVia(index: number){
    this.route.routeOptions.splice(index + 1, 1);
    this.viaStopControls.splice(index, 1);
    this.viaResidenceControls.splice(index, 1);
    this.stationSuggestions.splice(index + 2, 1);
    this.route.via.splice(index, 1);
    this.updateValidity();
  }

  originSelected(station: StationDto){
    this.route.origin = station;
    this.updateValidity();
  }

  viaSelected(index: number, station: StationDto){
    const currentViaStops = this.route.via;

    currentViaStops[index].id = station.id;
    currentViaStops[index].name = station.name;
    this.updateValidity();
  }

  destinationSelected(station: StationDto){
    this.route.destination = station;
    this.updateValidity();
  }

  private updateValidity(){
    const originSelected = this.route.origin != null;
    const destinationSelected = this.route.destination != null;
    const allViaStationsSelected = this.route.via.filter(via => via.id == null).length == 0;
    const allResidenceTimesValid = this.viaResidenceControls.filter(control => !control.valid).length == 0;

    this.validChange.emit(
      originSelected &&
      destinationSelected &&
      allViaStationsSelected &&
      allViaStationsSelected &&
      allResidenceTimesValid);
    //TODO: invalidate form field when text is changed after station is selected
  }
}
