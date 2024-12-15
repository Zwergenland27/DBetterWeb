import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {SearchService} from '../../search.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {Passenger} from '../../models/passenger.model';
import {DatePipe} from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimeControlComponent} from '../time-control/time-control.component';
import {PassengerControlComponent} from '../passenger-control/passenger-control.component';

@Component({
  selector: 'app-configurator',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    DatePipe,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TimeControlComponent,
    PassengerControlComponent,
  ],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent {
  myPassengers : Passenger[] = [Passenger.fromKnownUser(
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
  passengers: Passenger[] = [];

  tripDateTime = new Date();
  tripDateTimeType: 'departure' | 'arrival' = 'departure';

  constructor(
    public auth: AuthService,
    private searchService: SearchService) {
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
}
