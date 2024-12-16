import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';

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
  stay: number;
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
}
