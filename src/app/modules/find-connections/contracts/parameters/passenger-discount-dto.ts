import {DiscountComfortClass, DiscountType} from '../../components/passenger-options/passenger-options-data';

export interface PassengerDiscountDto {
  type: DiscountType,
  comfortClass: DiscountComfortClass
}
