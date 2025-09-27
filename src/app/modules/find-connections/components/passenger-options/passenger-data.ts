export interface PassengerData {
  id: string | null;
  name: string | null;
  age: number;
  bikes: number;
  dogs: number;
  discounts: Discount[]
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
