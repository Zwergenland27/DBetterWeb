import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {map, Observable, startWith} from 'rxjs';
import {RouteDto, StopDto, ViaStopDto} from '../../search.service';
import {MatIconButton} from '@angular/material/button';
import {MatChipOption, MatChipSet} from '@angular/material/chips';

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

  originStop = new FormControl('', Validators.required);
  viaStops : FormControl[] = [];
  destinationStop = new FormControl('', Validators.required);

  stopSuggestions: Observable<StopDto[]>[] = []
  _suggestions : StopDto[] = [
    { id: '1', name: 'Dresden Hbf', rl100: 'DH'},
    { id: '2', name: 'Dresden Neustadt', rl100: 'DN'},
    { id: '3', name: 'Berlin Ostkreuz', rl100: 'BO'},
    { id: '4', name: 'Frankfurt (MAIN) Hbf', rl100: 'FF'},
  ];
  constructor() {
    this.stopSuggestions[0] = this.originStop.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
    this.stopSuggestions[1] = this.destinationStop.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
  }

  private filter(value: string){
    if(value.length < 1) return [];
    const filterValue = value.toLowerCase();

    return this._suggestions
      .filter(stop => stop.name.toLowerCase().includes(filterValue) || (stop.rl100 && stop.rl100.toLowerCase() == filterValue))
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
    this.viaStops.splice(index, 0, new FormControl('', Validators.required));
    this.stopSuggestions[index + 2] = this.viaStops[index].valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
  }

  removeVia(index: number){
    this.route.routeOptions.splice(index, 1);
    this.viaStops.splice(index - 1, 1);
    this.stopSuggestions.splice(index + 1, 1);
    this.route.via.splice(index, 1);
    this.route.routeOptions.splice(index, 1);
    this.routeChange.emit(this.route);
  }

  originSelected(stop: StopDto){
    this.route.origin = stop;
    this.routeChange.emit(this.route);
  }

  viaSelected(index: number, stop: StopDto){
    const currentViaStops = this.route.via;
    const changedVia = <ViaStopDto> {
      id: stop.id,
      name: stop.name,
      rl100: stop.rl100,
      stay: 0
    }
    if(currentViaStops[index]){
      currentViaStops[index] = changedVia;
    }else{
      currentViaStops.splice(index, 0, changedVia);
    }
    console.log(this.route.via);
  }

  destinationSelected(stop: StopDto){
    this.route.destination = stop;
    this.routeChange.emit(this.route);
  }
}
