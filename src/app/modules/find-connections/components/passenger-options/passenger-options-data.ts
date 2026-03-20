import {PassengerParameter} from '../../contracts/parameters/passenger-parameter';

export interface PassengerOptionsData {
  id: string;
  userId: string | null;
  name: string | null;
  age: number;
  bikes: number;
  dogs: number;
  bahnCard25: SelectableDiscountClass;
  bahnCard25Business: SelectableDiscountClass;
  bahnCard50: SelectableDiscountClass;
  bahnCard50Business: SelectableDiscountClass;
  bahnCard100: SelectableDiscountClass;
  chGeneralAbonnement: SelectableDiscountClass;
  ownsHalbTaxAbo: boolean,
  ownsVorteilsCardAu: boolean,
  ownsNl40: boolean,
  ownsKlimaTicketAu: boolean,
  ownsDeutschlandTicket: boolean
}

export interface Discount {
  type: DiscountType;
  comfortClass: DiscountComfortClass;
}

export enum DiscountType {
  BahnCard25 = 'BahnCard25',
  BahnCard25Business = 'BahnCard25Business',
  BahnCard50 = 'BahnCard50 ',
  BahnCard50Business = 'BahnCard50Business',
  BahnCard100 = 'BahnCard100',
  CHGeneralAbonnement = 'CHGeneralAbonnement',
  HalbtaxAbo = 'HalbtaxAbo',
  VorteilsCardAu = 'VorteilsCardAu',
  Nl40 = 'Nl40',
  KlimaTicketAu = 'KlimaTicketAu',
  DeutschlandTicket = 'DeutschlandTicket'
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
    });
  }

  if(passenger.bahnCard25Business != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard25Business,
      comfortClass: convertToComfortClass(passenger.bahnCard25Business)
    });
  }

  if(passenger.bahnCard50 != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard50,
      comfortClass: convertToComfortClass(passenger.bahnCard50)
    });
  }

  if(passenger.bahnCard50Business != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard50Business,
      comfortClass: convertToComfortClass(passenger.bahnCard50Business)
    });
  }

  if(passenger.bahnCard100 != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.BahnCard100,
      comfortClass: convertToComfortClass(passenger.bahnCard100)
    });
  }

  if(passenger.chGeneralAbonnement != SelectableDiscountClass.None){
    discounts.push({
      type: DiscountType.CHGeneralAbonnement,
      comfortClass: convertToComfortClass(passenger.chGeneralAbonnement)
    });
  }

  if(passenger.ownsHalbTaxAbo){
    discounts.push({
      type: DiscountType.HalbtaxAbo,
      comfortClass: DiscountComfortClass.Unknown
    });
  }

  if(passenger.ownsVorteilsCardAu){
    discounts.push({
      type: DiscountType.VorteilsCardAu,
      comfortClass: DiscountComfortClass.Unknown
    });
  }

  if(passenger.ownsNl40){
    discounts.push({
      type: DiscountType.Nl40,
      comfortClass: DiscountComfortClass.Unknown
    });
  }

  if(passenger.ownsKlimaTicketAu){
    discounts.push({
      type: DiscountType.KlimaTicketAu,
      comfortClass: DiscountComfortClass.Second
    });
  }

  if(passenger.ownsDeutschlandTicket){
    discounts.push({
      type: DiscountType.DeutschlandTicket,
      comfortClass: DiscountComfortClass.Second
    });
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
