import {PassengerDiscountParameters} from './passenger-discount-parameters';

export interface PassengerParameter {
  age: number,
  bikes: number,
  dogs: number,
  discounts: PassengerDiscountParameters[]
}
