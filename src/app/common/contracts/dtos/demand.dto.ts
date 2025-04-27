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
