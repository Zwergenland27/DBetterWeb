export interface CateringInformationDto {
  status: CateringType;
  fromStopIndex: number;
  toStopIndex: number;
}

export enum CateringType
{
  None = 'None',
  NoInfo = 'NoInfo',
  Restaurant = 'Restaurant',
  Bistro = 'Bistro',
  SeatServed = 'SeatServed',
  Snack = 'Snack'
}
