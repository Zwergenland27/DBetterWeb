import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  public getMyPassengers(userId: string){
    return this.http.get<MyPassengersDto>(`users/${userId}/passengers`);
  }
}
