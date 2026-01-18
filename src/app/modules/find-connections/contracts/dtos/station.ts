export interface StationDto {
  id: string;
  name: string;
  ril100: string | null;
}

export class Station {
  constructor(
    public id: string,
    public name: string,
    public ril100: string | null,
  ) {
  }

  static fromDto(dto: StationDto): Station {
    return new Station(
      dto.id,
      dto.name,
      dto.ril100,
    );
  }

  public get nameWithRil100() {
    if(!this.ril100) return this.name;
    return `${this.name} [${this.ril100}]`;
  }
}
