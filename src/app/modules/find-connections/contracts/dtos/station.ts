export interface StationDto {
  id: string;
  name: string;
}

export class Station {
  constructor(
    public id: string,
    public name: string,
  ) {
  }

  static fromDto(dto: StationDto): Station {
    return new Station(
      dto.id,
      dto.name,
    );
  }
}
