import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {JourneySearchDto, SearchService} from './search.service';
import {AuthService} from '../../shared/services/auth.service';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
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
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TimeControlComponent,
    PassengerControlComponent,
    RouteControlComponent,
    MatFabButton,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  request: JourneySearchDto | null = null;
  routeValid: boolean = false;

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
    searchService.createRequest(auth.user()?.id).subscribe(
      result => {
        this.request = result;
      });
  }

  search(){
    console.log(this.request);
  }
}
