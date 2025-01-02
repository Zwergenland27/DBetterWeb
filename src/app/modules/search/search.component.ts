import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {ConnectionDto, Demand, RequestDto, SearchService} from './search.service';
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

  get bikeInfoRequired(){
    return this.request.passengers.filter(passenger => passenger.bikes > 0).length > 0;
  }

  get accessibilityInfoRequired(){
    return this.request.passengers.filter(passenger => passenger.needsAccessibility).length > 0;
  }

  connections: ConnectionDto[] = [
    {
    id: '0',
    startTime: '2025-01-01T14:48:00.000Z',
    endTime: '2025-01-01T15:48:00.000Z',
    sections: [
      {
        lineNr: 'ICE 1680',
        vehicle: [
          {
            name: 'ICE T lang',
            uicNumber: '401-001'
          }, {
            name: 'ICE T kurz',
            uicNumber: '401-002'
          }
        ],
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
        catering: 'Unknown',
        bike: 'Unknown',
        accessibility: 'Unknown',
        demand: Demand.Unknown,
        notifications: [],
        percentage: 100
      }
    ],
    notifications: [],
    price: 123.45
  },
    {
      id: '1',
      startTime: '2025-01-01T14:12:00.000Z',
      endTime: '2025-01-01T19:19:00.000Z',
      sections: [
        {
          lineNr: 'ICE 1680',
          vehicle: [
            {
              name: 'ICE T lang',
              uicNumber: '401-001'
            }, {
              name: 'ICE T kurz',
              uicNumber: '401-002'
            }
          ],
          stops: [
            {
              id: '0',
              name: 'Dresden Hbf',
              rl100: 'DH',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-01T14:12:00.000Z'
            },
            {
              id: '1',
              name: 'Leipzig Hbf',
              rl100: 'LL',
              lat: 0,
              lon: 0,
              arrival: '2025-01-01T15:48:00.000Z',
              departure: null
            }
          ],
          catering: 'Bistro',
          bike: 'Always',
          accessibility: 'Always',
          demand: Demand.Low,
          notifications: [],
          percentage: 20
        },
        {
          lineNr: 'ICE 1720',
          vehicle: [
            {
              name: 'ICE T lang',
              uicNumber: '401-001'
            }, {
              name: 'ICE T kurz',
              uicNumber: '401-002'
            }
          ],
          stops: [
            {
              id: '1',
              name: 'Leipzig Hbf',
              rl100: 'LL',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-01T16:00:00.000Z'
            },
            {
              id: '2',
              name: 'Frankfurt (Main) Hbf',
              rl100: 'FF',
              lat: 0,
              lon: 0,
              arrival: '2025-01-01T19:19:00.000Z',
              departure: null
            }
          ],
          catering: 'Restaurant',
          bike: 'Always',
          accessibility: 'Always',
          demand: Demand.Medium,
          notifications: [],
          percentage: 80
        }
      ],
      notifications: ['Aufgrund einer Stellwerkstörung ist der Zugverkehr im Großraum Frankfurt aktuell eingeschränkt.'],
      price: 123.45
    },
    {
      id: '2',
      startTime: '2025-01-17T14:10:00.000Z',
      endTime: '2025-01-18T04:13:00.000Z',
      sections: [
        {
          lineNr: 'ICE 1556',
          vehicle: [
            {
              name: 'ICE T lang',
              uicNumber: '401-001'
            }, {
              name: 'ICE T kurz',
              uicNumber: '401-002'
            }
          ],
          stops: [
            {
              id: '0',
              name: 'Dresden Hbf',
              rl100: 'DH',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-17T14:10:00.000Z'
            },
            {
              id: '1',
              name: 'Erfurt Hbf',
              rl100: 'EH',
              lat: 0,
              lon: 0,
              arrival: '2025-01-17T16:16:00.000Z',
              departure: null
            }
          ],
          catering: 'Partial',
          bike: 'Always',
          accessibility: 'Always',
          demand: Demand.Medium,
          notifications: ['Bordrestaurant eingschränkt'],
          percentage: 18.64
        },
        {
          lineNr: 'ICE 1111',
          vehicle: [
            {
              name: 'ICE 3 Neo',
              uicNumber: '401-001'
            }
          ],
          stops: [
            {
              id: '0',
              name: 'Erfurt Hbf',
              rl100: 'EH',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-17T16:50:00.000Z'
            },
            {
              id: '1',
              name: 'München Hbf',
              rl100: 'MH',
              lat: 0,
              lon: 0,
              arrival: '2025-01-17T19:11:00.000Z',
              departure: null
            }
          ],
          catering: 'Bistro',
          bike: 'Limited',
          accessibility: 'Always',
          demand: Demand.High,
          notifications: [],
          percentage: 20.86
        },
        {
          lineNr: 'ICE 422',
          vehicle: [
            {
              name: 'ICE 2',
              uicNumber: '401-001'
            }, {
              name: 'ICE 2',
              uicNumber: '401-002'
            }
          ],
          stops: [
            {
              id: '0',
              name: 'München Hbf',
              rl100: 'MH',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-17T19:47:00.000Z'
            },
            {
              id: '1',
              name: 'Köln Hbf',
              rl100: 'KH',
              lat: 0,
              lon: 0,
              arrival: '2025-01-18T00:32:00.000Z',
              departure: null
            }
          ],
          catering: 'None',
          bike: 'Limited',
          accessibility: 'None',
          demand: Demand.Extreme,
          notifications: ['Technische Störung am Zug', 'Ersatzzug verkehr mit verminderter Anzahl an Wagen'],
          percentage: 42.16
        },
        {
          lineNr: 'ICE 1920',
          vehicle: [
            {
              name: 'ICE 4',
              uicNumber: '401-001'
            }
          ],
          stops: [
            {
              id: '0',
              name: 'Köln Hbf',
              rl100: 'KH',
              lat: 0,
              lon: 0,
              arrival: null,
              departure: '2025-01-18T02:09:00.000Z'
            },
            {
              id: '1',
              name: 'Münster(Westf) Hbf',
              rl100: 'EH',
              lat: 0,
              lon: 0,
              arrival: '2025-01-18T04:13:00.000Z',
              departure: null
            }
          ],
          catering: 'Restaurant',
          bike: 'None',
          accessibility: 'Partial',
          demand: Demand.Low,
          notifications: [],
          percentage: 18.34
        }
      ],
      notifications: [],
      price: 123.45
    },];

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
