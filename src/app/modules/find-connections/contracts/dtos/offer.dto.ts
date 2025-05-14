import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';

export interface OfferDto {
  comfortClass: ComfortClass;
  price: number,
  currency: Currency,
  partial: boolean,
}

export enum Currency {
  Euro = 'Euro',
}

export function getShortCurrency(currency: Currency){
  if(currency == Currency.Euro) return "EUR";
  return "";
}
