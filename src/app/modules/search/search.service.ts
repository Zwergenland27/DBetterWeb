import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {withHttpTransferCacheOptions} from '@angular/platform-browser';

export function getShortTitleOfDiscount(discount: DiscountDto) : string {
  return discount.type.match(/[A-Z0-9]/g)?.join('') ?? '';
}

export type DiscountDto = {
  type: string;
  class: string;
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

export type StationDto = {
  id: string;
  name: string;
}

export type ViaStationDto = {
  id: string;
  name: string;
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

export type JourneySearchDto = {
  id: string;
  ownerId: string | null;
  passengers: PassengerDto[];
  time: string;
  timeType: 'arrival' | 'departure';
  route: RouteDto;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public createJourney(userId: string | null = null) : Observable<JourneySearchDto> {
    return of({
      id: '',
      ownerId: userId,
      passengers: [],
      time: new Date().toISOString(),
      timeType: 'departure',
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
    });
  }

  public getAvailablePassengers(journeyId: string) : Observable<UserDto[]> {
    return of();
  }

  public addPassenger(
    journeyId: string,
    userId: string | null,
    name: string,
    birthday: Date | null,
    age: number | null,
    withSeat: boolean,
    bikes: number,
    dogs: number,
    withBuggy: boolean,
    needsAccessibility: boolean,
    discounts: DiscountDto[]) : Observable<PassengerDto>{
    return of({
      id: 'id',
      userId: userId,
      name: name,
      birthday: birthday ? birthday.toISOString() : null,
      age: age,
      withSeat: withSeat,
      bikes: bikes,
      dogs: dogs,
      withBuggy: withBuggy,
      needsAccessibility: needsAccessibility,
      discounts: discounts
    });
  }

  public editPassenger(
    journeyId: string,
    passengerId: string,
    userId: string | null,
    name: string,
    birthday: Date | null,
    age: number | null,
    withSeat: boolean,
    bikes: number,
    dogs: number,
    withBuggy: boolean,
    needsAccessibility: boolean,
    discounts: DiscountDto[]) : Observable<PassengerDto>{
    return of({
      id: passengerId,
      userId: userId,
      name: name,
      birthday: birthday ? birthday.toISOString() : null,
      age: age,
      withSeat: withSeat,
      bikes: bikes,
      dogs: dogs,
      withBuggy: withBuggy,
      needsAccessibility: needsAccessibility,
      discounts: discounts
    });
  }

  public removePassenger(journeyId: string, passengerId: string) : Observable<void> {
    return of(undefined);
  }
}
