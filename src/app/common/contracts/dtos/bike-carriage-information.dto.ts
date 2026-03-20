export interface BikeCarriageInformationDto {
  status: BikeCarriageStatus;
  fromStopIndex: number;
  toStopIndex: number;
}

export enum BikeCarriageStatus {
  NoInfo = 'NoInfo',
  Limited = 'Limited',
  ReservationRequired = 'ReservationRequired',
  NotPossible = 'NotPossible'
}

export class BikeCarriageInformation {
  constructor(
    public status: BikeCarriageStatus,
    public fromStopIndex: number,
    public toStopIndex: number,
  ) {
  }

  static fromDto(dto: BikeCarriageInformationDto): BikeCarriageInformation {
    return new BikeCarriageInformation(
      dto.status,
      dto.fromStopIndex,
      dto.toStopIndex,
    );
  }
}
