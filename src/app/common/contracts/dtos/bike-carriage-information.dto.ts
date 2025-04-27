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
