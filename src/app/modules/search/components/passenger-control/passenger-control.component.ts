import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {PassengerCardComponent} from "../passenger-card/passenger-card.component";
import {PassengerDialogComponent} from '../passenger-dialog/passenger-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Passenger} from '../../models/passenger.model';

@Component({
  selector: 'app-passenger-control',
    imports: [
        MatButton,
        PassengerCardComponent
    ],
  templateUrl: './passenger-control.component.html',
  styleUrl: './passenger-control.component.css'
})
export class PassengerControlComponent {
  @Input() myPassengers : Passenger[] = [];
  @Input({required: true}) passengers! : Passenger[];
  @Output() passengersChange = new EventEmitter<Passenger[]>();

  private frontendPassengerId = 0;

  constructor(private dialog: MatDialog) {
  }

  private _getNextPassengerId () {
    return this.frontendPassengerId++;
  }
  public addPassenger(){
    const currentPassengerIds = this.passengers.filter(passenger => passenger.id != null).map(passenger => passenger.id);
    const notAddedPassengers = this.myPassengers.filter(passenger => !currentPassengerIds.includes(passenger.id));
    this.dialog.open(PassengerDialogComponent, {
      data: notAddedPassengers
    }).afterClosed().subscribe(
      result => {
        if(result){
          result.frontendId = this._getNextPassengerId();
          this.passengers.push(result);
          this.passengersChange.emit(this.passengers);
        }
      }
    );
  }

  public editPassenger(frontendId: number | null){
    const passenger = this.passengers.find(p => p.frontendId === frontendId);
    if(passenger == undefined){
      return;
    }

    this.dialog.open(PassengerDialogComponent, {
      data: [passenger]
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers = this.passengers.filter(p => p.frontendId !== frontendId);
          result.frontendId = this._getNextPassengerId();
          this.passengers.push(result);
        }else if(result === null){
          this.passengers = this.passengers.filter(p => p.frontendId !== frontendId);
        }
        this.passengersChange.emit(this.passengers);
      }
    );
  }
}
