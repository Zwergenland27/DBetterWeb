export interface DemandDto {
  firstClass: DemandStatus,
  secondClass: DemandStatus,
}

export enum DemandStatus {
  Unknown = 'Unknown',
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Extreme = 'Extreme',
  Overbooked = 'Overbooked',
}

export class Demand {
  constructor(
    public firstClass: DemandStatus,
    public secondClass: DemandStatus,
  ) {
  }

  static fromDto(dto: DemandDto): Demand {
    return new Demand(
      dto.firstClass,
      dto.secondClass,
    );
  }
}
