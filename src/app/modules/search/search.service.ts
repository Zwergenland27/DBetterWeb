import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {Passenger} from './models/passenger.model';

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
  firstname: string;
  lastname: string;
  email: string;
  birthday: string;
  discounts: DiscountDto[];
}

export type MyPassengersDto = {
  me: PassengerDto;
  family: PassengerDto[];
  friends: PassengerDto[];
}

export type StationDto = {
  id: string;
  rl100: string | null;
  name: string;
  lat: number;
  lon: number;
}

export type ViaStationDto = {
  id: string;
  rl100: string | null;
  name: string;
  residenceMinutes: number;
  lat: number;
  lon: number;
}

export type RouteOptionDto = {
  transports: string[]
}

export type RouteDto = {
  origin: StationDto | null;
  destination: StationDto | null;
  via: ViaStationDto[];
  routeOptions: RouteOptionDto[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public getMyPassengers(userId: string){
    return this.http.get<MyPassengersDto>(`users/${userId}/passengers`);
  }

  public getStationSuggestions(value: string | null) {
    if(!value || value.length < 1){
      return of([]);
    }
    return this.http.get<StationDto[]>(`stations?search=${value}`);
  }

  public searchTrip(passengers: Passenger[], dateTime: Date, dateTimeType: 'departure' | 'arrival', route: RouteDto){
    return this.http.post(`trip`, {
      passengers: passengers.map(p => {
        return {
          id: p.id,
          name: p.name,
          birthday: p.birthday?.toISOString(),
          age: p.age,
          withSeat: p.withSeat,
          bikes: p.withBike ? 1 : 0,
          dogs: p.withDog ? 1 : 0,
          withBuggy: p.withBuggy,
          needsWheelchair: p.needsWheelchair,
          discounts: p.discounts.map(d => {
            return {
              type: d.type,
              class: d.class,
              validUntil: d.validUntil ? new Date(d.validUntil).toISOString() : null,
            }
          })
        }
      }),
      dateTime: dateTime.toISOString(),
      dateTimeType: dateTimeType,
      route: {
        originId: route.origin!.id,
        destinationId: route.destination!.id,
        via: route.via.map(v => {
          return {
            id: v.id,
            residenceMinutes: v.residenceMinutes
          }
        }),
        options: route.routeOptions.map(r => {
          return {
            allowedTransports: r.transports,
          }
        })
      }
    })
  }
}
