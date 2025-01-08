import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ConnectionDto, ConnectionSectionDto, Demand, RequestDto, SearchService} from './search.service';
import {AuthService} from '../../shared/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TimeControlComponent} from './components/time-control/time-control.component';
import {PassengerControlComponent} from './components/passenger-control/passenger-control.component';
import {RouteControlComponent} from './components/route-control/route-control.component';
import {MatButton, MatFabButton} from '@angular/material/button';
import {OptionsControlComponent} from './components/options-control/options-control.component';
import {ConnectionCardComponent} from './components/connection-card/connection-card.component';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {DatePipe, NgIf} from '@angular/common';

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
    MatProgressSpinner,
    DatePipe,
    MatButton,
    NgIf,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  request: RequestDto;

  routeValid: boolean = false;

  get bikeInfoRequired(){
    return this.request.passengers.filter(passenger => passenger.bikes > 0).length > 0;
  }

  get accessibilityInfoRequired(){
    return this.request.passengers.filter(passenger => passenger.needsAccessibility).length > 0;
  }

  get requestedClass(){
    return this.request.options.class;
  }

  getStartDate(connection: ConnectionDto){
    return new Date(connection.sections[0].stops[0].departure!);
  }

  getCompareDate(connection: ConnectionDto){
    return this.getStartDate(connection).toDateString();
  }

  connections: ConnectionDto[] | null = null;
  connectionsLoading = false;
  pageEarlier: string | null = null;
  pageEarlierLoading = false;
  pageLater: string | null = null;
  pageLaterLoading = false;

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

  searchEarlier(){
    this.pageEarlierLoading = true;
    this.searchService.getResults(this.request, this.pageEarlier).subscribe({
        next: result => {
          this.connections = [...result.connections, ...this.connections!];
          this.pageEarlier = result.pageEarlier;
        },
        complete: () => {this.pageEarlierLoading = false}
      });
  }

  searchLater(){
    this.pageLaterLoading = true;
    this.searchService.getResults(this.request, this.pageLater).subscribe({
      next: result => {
        this.connections = [...this.connections!, ...result.connections];
        this.pageLater = result.pageLater;
      },
      complete: () => {this.pageLaterLoading = false}
    });
  }

  search(){
    this.connectionsLoading = true;
    this.searchService.getResults(this.request).subscribe({
      next: result => {
        this.connections = result.connections;
        this.pageEarlier = result.pageEarlier;
        this.pageLater = result.pageLater;
      },
      complete: () => {this.connectionsLoading = false}
    });
  }
}
