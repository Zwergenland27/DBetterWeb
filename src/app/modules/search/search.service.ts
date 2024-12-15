import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

export type StopDto = {
  id: string;
  rl100: string | null;
  name: string;
}

export type ViaStopDto = {
  id: string;
  rl100: string | null;
  name: string;
  stay: number;
}

export type RouteOptionDto = {
  transports: string[]
}

export type RouteDto = {
  origin: StopDto | null;
  destination: StopDto | null;
  via: ViaStopDto[];
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
}
