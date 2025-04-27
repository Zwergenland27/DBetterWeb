export interface PlatformDto {
  planned: string;
  real: string | undefined;
  type: PlatformType;
}

export enum PlatformType {
  Platform = 'Platform',
  BusPlatform = 'BusPlatform',
  Unknown = 'Unknown',
}
