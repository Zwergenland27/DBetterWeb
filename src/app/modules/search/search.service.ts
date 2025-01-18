import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {StationDto} from '../station/station.service';

export function getShortTitleOfDiscount(discount: DiscountDto) : string {
  return discount.type.match(/[A-Z0-9]/g)?.join('') ?? '';
}

export type DiscountDto = {
  type: string;
  class: 'First' | 'Second';
  validUntil: string | null;
}

export type PassengerDto = {
  id: string;
  userId: string | null;
  name: string | null;
  birthday: string | null;
  age: number | null;
  withSeat: boolean,
  bikes: number,
  dogs: number,
  withBuggy: boolean,
  needsAccessibility: boolean,
  discounts: DiscountDto[];
}

export type UserDto = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
  seatPreference: boolean;
  bikePreference: number;
  dogPreference: number;
  buggyPreference: boolean;
  needsAccessibility: boolean;
  discounts: DiscountDto[]
}

export type ViaStationDto = {
  station: StationDto | null;
  residence: number;
}

export type RouteOptionDto = {
  allowHighSpeedTrains: boolean;
  allowIntercityTrains: boolean;
  allowRegionalTrains: boolean;
  allowPublicTransport: boolean;
}

export type RouteDto = {
  origin: StationDto | null;
  destination: StationDto | null;
  via: ViaStationDto[];
  routeOptions: RouteOptionDto[];
}

export type OptionsDto = {
  class: 'First' | 'Second';
  maxTransfers: number,
  minTransferTime: number,
}

export type RequestDto = {
  id: string;
  ownerId: string | null;
  passengers: PassengerDto[];
  time: string;
  timeType: 'Arrival' | 'Departure';
  options: OptionsDto;
  route: RouteDto;
}

export type FixSectionStationDto = {
  extId: string;
  time: string;
}

export type IncreaseTransferTimeRequestDto = {
  id: string;
  contextId: string;
  ownerId: string | null;
  passengers: PassengerDto[];
  options: OptionsDto;
  route: RouteDto;
  begin: FixSectionStationDto;
  end: FixSectionStationDto;
}

export type ConnectionStationDto = {
  arrival: string | null,
  realTimeArrival: string | null,
  departure: string | null,
  realTimeDeparture: string | null,
  information: Information[],
  platform: string,
  demand: Demand
} & StationDto;

export type Demand = {
  firstClass: 'Unknown' | 'Low' | 'Medium' | 'High' | 'Extreme',
  secondClass: 'Unknown' | 'Low' | 'Medium' | 'High' | 'Extreme';
}

export type Information = {
  priority: number;
  code: string;
  text: string;
  routeIndexStart : number | null;
  routeIndexEnd : number | null;
}

export type PriceDto =  {
  value: number;
  currency: string;
  sectionPrice: boolean;
}

export type ConnectionSectionDto = {
  lineNameShort: string;
  lineNameMedium: string;
  lineNameFull: string;
  lineNumber: string;
  category: string;
  direction: string | null;
  percentage: number,
  catering: 'None' | 'Snack' | 'PartialSnack' | 'SnackService' | 'Bistro' | 'Restaurant' | 'PartialRestaurant' | 'Unknown'
  bike: 'No' | 'ReservationRequired' | 'Limited' | 'Unknown',
  accessibility: 'None' | 'PartialAccessible' | 'Accessible' | 'Unknown',
  demand: Demand,
  information: Information[],
  reservationRequired: boolean,
  connectionPrediction: 'Reachable' | 'Unknown' | null
  stops : ConnectionStationDto[]
}

export type ConnectionsDto = {
  connections: ConnectionDto[];
  pageEarlier: string;
  pageLater: string;
}

export type VehicleDto = {
  coaches: string[];
  realTime: boolean;
}

export type ConnectionDto = {
  id: string,
  contextId: string,
  transferTimeChanged: boolean,
  sections: ConnectionSectionDto[],
  price: PriceDto | null,
  information: Information[],
  bike: 'Yes' | 'No' | 'Unknown' | null,
  demand: Demand,
  bahnRequestUrl: string,
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private REQUEST_KEY = 'request';
  constructor(private http: HttpClient) { }

  public storeLocalRequest(request: RequestDto) {
    sessionStorage.setItem(this.REQUEST_KEY, JSON.stringify(request));
  }

  public getLocalRequest() : RequestDto | null {
    const json = sessionStorage.getItem(this.REQUEST_KEY);
    if(!json) return null;
    return JSON.parse(json);
  }

  public createRequest(userId: string | null = null) : RequestDto {
    return {
      id: crypto.randomUUID(),
      ownerId: userId,
      passengers: [],
      time: new Date().toISOString(),
      timeType: 'Departure',
      options: {
        class: 'Second',
        maxTransfers: 10,
        minTransferTime: 5,
      },
      route: {
        origin: null,
        destination: null,
        via: [],
        routeOptions: [{
          allowHighSpeedTrains: true,
          allowIntercityTrains: true,
          allowRegionalTrains: false,
          allowPublicTransport: false,
        }]
      }
    };
  }

  public getResults(request: RequestDto, page: string | null = null) : Observable<ConnectionsDto> {
    if(!page){
      return this.http.post<ConnectionsDto>(`search`, request);
    }
    return this.http.post<ConnectionsDto>(`search?page=${page}`, request);
  }

  public getConnection(
    contextId: string,
    transferIncreaseType: 'Earlier' | 'Later',
    fixStationStart: ConnectionStationDto,
    fixStationEnd: ConnectionStationDto) : Observable<ConnectionDto> {
    const request = this.getLocalRequest();
    if(!request) return of();

    const fixRouteRequest : IncreaseTransferTimeRequestDto = {
      id: request.id,
      contextId: contextId,
      ownerId: request.ownerId,
      passengers: request.passengers,
      options: request.options,
      route: request.route,
      begin: {
        extId: fixStationStart.extId,
        time: fixStationStart.departure!
      },
      end: {
        extId: fixStationEnd.extId,
        time: fixStationEnd.arrival!
      }
    }

    return this.http.post<ConnectionDto>(`connection?transferIncreaseType=${transferIncreaseType}`, fixRouteRequest);
  }

  public getVehicle(category: string, lineNumber: string, departureStation: string, departure: string, arrivalStation: string, arrival: string){
    return this.http.get<VehicleDto | null>(`vehicle?category=${category}&lineNumber=${lineNumber}&departureStation=${departureStation}&departure=${departure}&arrivalStation=${arrivalStation}&arrival=${arrival}`);
  }

  public getAvailablePassengers(userId: string) : Observable<UserDto[]> {
    return of();
  }
}
