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
      },
    };
  }

  public getResults(request: RequestDto) : Observable<void> {
    return of(undefined);
  }

  public getAvailablePassengers(userId: string) : Observable<UserDto[]> {
    return of();
  }
}
