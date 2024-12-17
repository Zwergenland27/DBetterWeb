import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {RouteDto, SearchService} from './search.service';
import {AuthService} from '../../shared/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {Passenger} from './models/passenger.model';
import {DatePipe} from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimeControlComponent} from './components/time-control/time-control.component';
import {PassengerControlComponent} from './components/passenger-control/passenger-control.component';
import {RouteControlComponent} from './components/route-control/route-control.component';
import {MatFabButton} from '@angular/material/button';

@Component({
  selector: 'app-search',
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
    RouteControlComponent,
    MatFabButton,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
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
  route : RouteDto = {
    origin: null,
    destination: null,
    via: [],
    routeOptions: [{
      transports: ['ice', 'ic']
    }]
  }

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

  routeInvalid(){
    return !this.route.origin || !this.route.origin || this.route.via.length < this.route.routeOptions.length - 1;
  }

  search(){
    this.searchService.searchTrip(this.passengers, this.tripDateTime, this.tripDateTimeType, this.route)
      .subscribe({
        next: result => {console.log(result)}
      })
  }
}
