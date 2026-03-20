export interface CateringInformationDto {
  type: CateringType;
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

export class CateringInformation {
  constructor(
    public status: CateringType,
    public fromStopIndex: number,
    public toStopIndex: number,
  ) {
  }

  static fromDto(dto: CateringInformationDto): CateringInformation {
    return new CateringInformation(
      dto.type,
      dto.fromStopIndex,
      dto.toStopIndex,
    );
  }
}
