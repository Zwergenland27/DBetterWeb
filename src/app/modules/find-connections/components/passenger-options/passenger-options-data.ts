import {PassengerParameter} from '../../contracts/parameters/passenger-parameter';

export interface PassengerOptionsData {
  id: string;
  userId: string | null;
  name: string | null;
  age: number;
  bikes: number;
  dogs: number;
  bahnCard25: SelectableDiscountClass;
  bahnCard50: SelectableDiscountClass;
  bahnCard100: SelectableDiscountClass;
}

export interface Discount {
  type: DiscountType;
  comfortClass: DiscountComfortClass;
}

export enum DiscountType {
  BahnCard25 = 'BahnCard25',
  BahnCard50 = 'BahnCard50 ',
  BahnCard100 = 'BahnCard100',
}

export enum DiscountComfortClass {
  First = 'First',
  Second = 'Second',
  Unknown = 'Unknown',
}

export enum SelectableDiscountClass{
  None = 'None',
  First = 'First',
  Second = 'Second',
}

export function mapToPassengerParameter(passenger: PassengerOptionsData) : PassengerParameter {
  const discounts : Discount[] = [];

  if(passenger.bahnCard25 != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard25,
      comfortClass: convertToComfortClass(passenger.bahnCard25)
    })
  }

  if(passenger.bahnCard50 != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard50,
      comfortClass: convertToComfortClass(passenger.bahnCard50)
    })
  }

  if(passenger.bahnCard100 != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard100,
      comfortClass: convertToComfortClass(passenger.bahnCard100)
    })
  }

  return {
    id: passenger.id,
    age: passenger.age,
    bikes: passenger.bikes,
    dogs: passenger.dogs,
    discounts: discounts
  };
}

function convertToComfortClass(discount: SelectableDiscountClass): DiscountComfortClass {
  if(discount === SelectableDiscountClass.None){
    throw new Error("Cannot convert from none to comfort class")
  }

  if(discount === SelectableDiscountClass.First){
    return DiscountComfortClass.First;
  }

  return DiscountComfortClass.Second;
}
