import {Component, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {SearchService} from '../../search.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDialog} from '@angular/material/dialog';
import {PassengerDialogComponent} from '../passenger-dialog/passenger-dialog.component';
import {Passenger} from '../../models/passenger.model';
import {PassengerCardComponent} from '../passenger-card/passenger-card.component';

@Component({
  selector: 'app-configurator',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    MatButton,
    PassengerCardComponent,
  ],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent {
  private myPassengers : Passenger[] = [Passenger.fromKnownUser(
    '5',
    'Test',
    new Date(),
    false,
    false,
    false,
    false,
    false,
    [
      {
        type: 'BahnCard25',
        class: 'Second',
        validUntil: new Date().toISOString(),
      }
    ]
  )];
  private frontendPassengerId = 0;

  private getNextPassengerId () {
    return this.frontendPassengerId++;
  }

  passengers = signal<Passenger[]>([]);
  constructor(
    public auth: AuthService,
    private searchService: SearchService,
    private dialog: MatDialog) {
    const currentUser = auth.user();
    if(currentUser != null) {
      searchService.getMyPassengers(currentUser.id).subscribe({
        next: result => {
          this.myPassengers.push(Passenger.fromDto(result.me));
          result.friends.forEach(dto => {
            this.myPassengers.push(Passenger.fromDto(dto));
          });
          result.family.forEach(dto => {
            this.myPassengers.push(Passenger.fromDto(dto));
          });
        }
      });
    }
  }

  public addPassenger(){
    this.dialog.open(PassengerDialogComponent, {
      data: this.myPassengers,
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.myPassengers = this.myPassengers.filter(passenger => passenger.id != result.id);
          result.frontendId = this.getNextPassengerId();
          this.passengers().push(result);
        }
      }
    );
  }

  public removePassenger(id: number | null){
    this.passengers.set(this.passengers().filter(p => p.frontendId !== id));
  }

  public editPassenger(frontendId: number | null){
    const passenger = this.passengers().find(p => p.frontendId === frontendId);
    if(passenger == undefined){
      return;
    }

    this.dialog.open(PassengerDialogComponent, {
      data: [passenger]
    }).afterClosed().subscribe(
      result => {
        if(result){
          this.passengers.set(this.passengers().filter(p => p.frontendId !== frontendId));
          result.frontendId = this.getNextPassengerId();
          this.passengers().push(result);
        }else if(result === null){
          this.removePassenger(frontendId);
        }
      }
    );
  }
}
