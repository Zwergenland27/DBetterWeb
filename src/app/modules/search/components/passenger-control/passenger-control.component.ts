import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFabButton} from "@angular/material/button";
import {PassengerCardComponent} from "../passenger-card/passenger-card.component";
import {PassengerDialogComponent, PassengerDialogData} from '../passenger-dialog/passenger-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PassengerDto, SearchService, UserDto} from '../../search.service';
import {
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {ExpansionPanelComponent} from '../expansion-panel/expansion-panel.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-passenger-control',
  imports: [
    PassengerCardComponent,
    MatExpansionPanelTitle,
    ExpansionPanelComponent,
    MatFabButton,
    MatIconModule
  ],
  templateUrl: './passenger-control.component.html',
  styleUrl: './passenger-control.component.css'
})
export class PassengerControlComponent {
  private UI_KEY = 'passenger-control-ui';
  expanded : boolean;

  @Input({required: true}) userId!: string | null;
  @Input({required: true}) passengers! : PassengerDto[];
  @Output() passengersChange = new EventEmitter<PassengerDto[]>();

  private myPassengers : UserDto[] = [];


  constructor(
    private searchService: SearchService,
    private dialog: MatDialog) {
    if(this.userId){
      searchService.getAvailablePassengers(this.userId).subscribe(result => this.myPassengers = result);
    }

    const uiState = sessionStorage.getItem(this.UI_KEY);
    if(uiState){
      this.expanded = JSON.parse(uiState);
    }else{
      this.expanded = true;
    }
  }
  public addPassenger(){
    this.dialog.open(PassengerDialogComponent, {
      data: <PassengerDialogData> {
        availableUsers: this._filteredPassengers,
        passengerToEdit: null
      }
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers.push(result);
          this.passengersChange.emit(this.passengers);
        }
      }
    );
  }

  public editPassenger(id: string){
    const passenger = this.passengers.find(p => p.id === id);
    if(passenger == undefined){
      return;
    }

    this.dialog.open(PassengerDialogComponent, {
      data: <PassengerDialogData> {
        availableUsers: this._filteredPassengers,
        passengerToEdit: passenger
      }
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers = this.passengers.filter(p => p.id !== id);
          this.passengers.push(result);
          this.passengersChange.emit(this.passengers);
        }else if(result === null){
          this.removePassenger(id);
        }
      }
    );
  }

  public removePassenger(id: string){
    this.passengers = this.passengers.filter(p => p.id !== id);
    this.passengersChange.emit(this.passengers);
  }

  public persistUIState(){
    sessionStorage.setItem(this.UI_KEY, JSON.stringify(this.expanded));
  }

  private get _filteredPassengers() : UserDto[] {
    return this.myPassengers.filter(user => this.passengers.find(passenger => passenger.userId === user.id) == null);
  }
}
