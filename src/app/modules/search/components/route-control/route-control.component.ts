import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {catchError, debounceTime, Observable, of, switchMap} from 'rxjs';
import {RouteDto, RouteOptionDto, ViaStationDto} from '../../search.service';
import {MatIconButton} from '@angular/material/button';
import {MatChipOption, MatChipSet} from '@angular/material/chips';
import {StationDto, StationService} from '../../../station/station.service';
import {
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {ExpansionPanelComponent} from '../expansion-panel/expansion-panel.component';

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
    MatExpansionPanelTitle,
    ExpansionPanelComponent
  ],
  templateUrl: './route-control.component.html',
  styleUrls: ['./route-control.component.css', '../../search.component.css']
})
export class RouteControlComponent implements OnInit {
  private UI_KEY = 'route-control-ui';
  expanded : boolean;

  @Input({required: true}) route! : RouteDto;
  @Output() routeChange = new EventEmitter<RouteDto>();
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

    const uiState = sessionStorage.getItem(this.UI_KEY);
    if(uiState){
      this.expanded = JSON.parse(uiState);
    }else{
      this.expanded = true;
    }
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
    this.routeChange.emit(this.route);
  }

  ngOnInit() {
    this._loadInitialData();
  }
  private _loadInitialData() {
    const route = this.route;

    if(route.origin){
      this.originControl.setValue(route.origin.name)
    }
    if(route.destination){
      this.destinationControl.setValue(route.destination.name)
    }

    const via = route.via.slice();
    const routeOptions = this.route.routeOptions.slice();
    route.via.splice(0, route.via.length);
    route.routeOptions.splice(1, route.routeOptions.length);
    for(let i = 0; i < via.length; i++){
      this.addVia(i, routeOptions[i + 1]);
      if(via[i].station){
        this.viaSelected(i, via[i].station!);
        this.viaStopControls[i].setValue(via[i].station!.name);
      }
      const hours = Math.floor(via[i].residence / 60);
      const minutes = via[i].residence % 60;
      this.viaResidenceControls[i].setValue(`${this.padZero(hours)}:${this.padZero(minutes)}`);
    }
    this.updateValidity();
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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

  addVia(index: number, routeOptions: RouteOptionDto | null){
    const previousOptions = JSON.parse(JSON.stringify(this.route.routeOptions[index]));
    if(!routeOptions){
      routeOptions = previousOptions;
    }
    this.route.routeOptions.splice(index + 1, 0, routeOptions!);

    const addedVia = <ViaStationDto> {
      station: null,
      residence: 0
    }
    this.viaStopControls.splice(index, 0, new FormControl('', Validators.required));
    const residenceControl = new FormControl('00:00', [Validators.required, Validators.pattern(/^\d{2}:\d{2}$/)]);
    residenceControl.statusChanges.subscribe((status) => {
      if(status == 'VALID'){
        const currentIndex = this.viaResidenceControls.findIndex(control => control == residenceControl);
        const [minutes, seconds] = residenceControl.value!.split(':').map(Number);
        this.route.via[currentIndex].residence = minutes * 60 + seconds;
        this.routeChange.emit(this.route);
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
    this.routeChange.emit(this.route);
  }

  removeVia(index: number){
    this.route.routeOptions.splice(index + 1, 1);
    this.viaStopControls.splice(index, 1);
    this.viaResidenceControls.splice(index, 1);
    this.stationSuggestions.splice(index + 2, 1);
    this.route.via.splice(index, 1);
    this.updateValidity();
    this.routeChange.emit(this.route);
  }

  originSelected(station: StationDto){
    this.route.origin = station;
    this.updateValidity();
    this.routeChange.emit(this.route);
  }

  viaSelected(index: number, station: StationDto){
    const currentViaStops = this.route.via;

    currentViaStops[index].station = station;
    this.updateValidity();
    this.routeChange.emit(this.route);
  }

  destinationSelected(station: StationDto){
    this.route.destination = station;
    this.updateValidity();
    this.routeChange.emit(this.route);
  }

  public persistUIState(){
    sessionStorage.setItem(this.UI_KEY, JSON.stringify(this.expanded));
  }

  private updateValidity(){
    const originSelected = this.route.origin != null;
    const destinationSelected = this.route.destination != null;
    const allViaStationsSelected = this.route.via.filter(via => via.station == null).length == 0;
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
