import {DiscountComfortClass, DiscountType} from '../../components/passenger-options/passenger-data';

export interface PassengerDiscountParameters {
  type: DiscountType,
  comfortClass: DiscountComfortClass
}
