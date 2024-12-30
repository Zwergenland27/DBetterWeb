import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {PassengerCardComponent} from "../passenger-card/passenger-card.component";
import {PassengerDialogComponent, PassengerDialogData} from '../passenger-dialog/passenger-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PassengerDto, SearchService, UserDto} from '../../search.service';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-passenger-control',
  imports: [
    MatButton,
    PassengerCardComponent,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon
  ],
  templateUrl: './passenger-control.component.html',
  styleUrls: ['./passenger-control.component.css', '../../search.component.css']
})
export class PassengerControlComponent {
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
          this.passengers = this.passengers.filter(p => p.id !== id);
          this.passengersChange.emit(this.passengers);
        }
      }
    );
  }

  private get _filteredPassengers() : UserDto[] {
    return this.myPassengers.filter(user => this.passengers.find(passenger => passenger.userId === user.id) == null);
  }
}
