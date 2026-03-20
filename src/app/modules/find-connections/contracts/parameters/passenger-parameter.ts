import {PassengerDiscountParameters} from './passenger-discount-parameters';

export interface PassengerParameter {
  id: string,
  age: number,
  bikes: number,
  dogs: number,
  discounts: PassengerDiscountParameters[]
}
