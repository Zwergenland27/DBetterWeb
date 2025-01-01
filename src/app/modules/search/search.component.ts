import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ConnectionDto, RequestDto, SearchService} from './search.service';
import {AuthService} from '../../shared/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimeControlComponent} from './components/time-control/time-control.component';
import {PassengerControlComponent} from './components/passenger-control/passenger-control.component';
import {RouteControlComponent} from './components/route-control/route-control.component';
import {MatFabButton} from '@angular/material/button';
import {OptionsControlComponent} from './components/options-control/options-control.component';
import {ConnectionCardComponent} from './components/connection-card/connection-card.component';

@Component({
  selector: 'app-search',
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatGridListModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TimeControlComponent,
    PassengerControlComponent,
    RouteControlComponent,
    MatFabButton,
    OptionsControlComponent,
    ConnectionCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  request: RequestDto;

  routeValid: boolean = false;

  connections: ConnectionDto[] = [{
    id: '0',
    startTime: '2025-01-01T14:48:00.000Z',
    endTime: '2025-01-01T15:48:00.000Z',
    sections: [
      {
        vehicle: 'ICE 1',
        stops: [
          {
            id: '0',
            name: 'Dresden Hbf',
            rl100: 'DH',
            lat: 0,
            lon: 0,
            arrival: null,
            departure: '2025-01-01T14:48:00.000Z'
          },
          {
            id: '1',
            name: 'Frankfurt',
            rl100: 'FF',
            lat: 0,
            lon: 0,
            arrival: '2025-01-01T15:48:00.000Z',
            departure: null
          }
        ],
        percentage: 1
      }
    ],
    notifications: ['Test Notification'],
    price: 123.45
  }];

  get passengersValid() {
    return this.request.passengers.length > 0;
  }

  get time() {
    const msIn15Minutes = 15 * 60 * 1000;
    const time = this.request!.time!;
    const millis = new Date(time).getTime();
    const flooredTime = Math.floor(millis / msIn15Minutes) * msIn15Minutes
    return new Date(flooredTime);
  }

  set time(value: Date) {
    this.request!.time = value.toISOString();
  }

  get userId(){
    const user = this.auth.user();
    if(!user){
      return null;
    }
    return user.id;
  }

  constructor(
    public auth: AuthService,
    private searchService: SearchService) {
    const request = searchService.getLocalRequest();
    if(request){
      this.request = request;
    }else{
      this.request = searchService.createRequest(auth.user()?.id);
      searchService.storeLocalRequest(this.request);
    }
  }

  requestDataChanged(){
    this.searchService.storeLocalRequest(this.request);
  }

  search(){
    this.searchService.getResults(this.request).subscribe(results => {
      console.log(this.request);
    })
  }
}
