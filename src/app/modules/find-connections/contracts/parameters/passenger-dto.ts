import {PassengerDiscountDto} from './passenger-discount-dto';

export interface PassengerDto {
  id: string,
  age: number,
  bikes: number,
  dogs: number,
  discounts: PassengerDiscountDto[]
}
