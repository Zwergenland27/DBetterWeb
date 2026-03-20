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

export class Offer {
  constructor(
    public comfortClass: ComfortClass,
    public price: number,
    public currency: Currency,
    public partial: boolean,
  ) {
  }

  static fromDto(dto: OfferDto): Offer {
    return new Offer(
      dto.comfortClass,
      dto.price,
      dto.currency,
      dto.partial,
    );
  }

  get shortCurrency(){
    if(this.currency == Currency.Euro) return "EUR";
    return "";
  }
}
