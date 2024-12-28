import {Component, Input} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {PassengerCardComponent} from "../passenger-card/passenger-card.component";
import {AddPassengerDialogComponent} from '../add-passenger-dialog/add-passenger-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PassengerDto} from '../../search.service';
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
  @Input({required: true}) requestId! : string;
  @Input({required: true}) passengers! : PassengerDto[];

  constructor(private dialog: MatDialog) {
  }
  public addPassenger(){
    this.dialog.open(AddPassengerDialogComponent, {
      data: this.requestId
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers.push(result);
        }
      }
    );
  }

  public editPassenger(id: string){
    const passenger = this.passengers.find(p => p.id === id);
    if(passenger == undefined){
      return;
    }

    this.dialog.open(AddPassengerDialogComponent, {
      data: [passenger]
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers = this.passengers.filter(p => p.id !== id);
          this.passengers.push(result);
        }else if(result === null){
          this.passengers = this.passengers.filter(p => p.id !== id);
        }
      }
    );
  }
}
