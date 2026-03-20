import {DiscountComfortClass, DiscountType} from '../../components/passenger-options/passenger-options-data';

export interface PassengerDiscountParameters {
  type: DiscountType,
  comfortClass: DiscountComfortClass
}
