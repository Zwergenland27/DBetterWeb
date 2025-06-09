export interface PlatformDto {
  planned: string;
  real: string | null;
  type: PlatformType;
}

export enum PlatformType {
  Platform = 'Platform',
  BusPlatform = 'BusPlatform',
  Unknown = 'Unknown',
}

export class Platform {
  constructor(
    public planned: string,
    public real: string | null,
    public type: PlatformType,
  ) {
  }

  static fromDto(dto: PlatformDto): Platform {
    return new Platform(
      dto.planned,
      dto.real,
      dto.type,
    );
  }

  get shortType(): string {
    switch(this.type) {
      case PlatformType.Platform: return $localize`:@@platform_short:Pl.`
      case PlatformType.BusPlatform: return $localize`:@@bus_platform_short:Pl.`
      case PlatformType.Unknown: return ''
    }
  }
}
