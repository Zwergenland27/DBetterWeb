export interface MeansOfTransportDto {
  highSpeedTrains: boolean;
  fastTrains: boolean;
  regionalTrains: boolean;
  suburbanTrains: boolean;
  undergroundTrains: boolean;
  trams: boolean;
  busses: boolean;
  boats: boolean;
}

export function getMeansOfTransportDefault() : MeansOfTransportDto {
  return {
    highSpeedTrains: true,
    fastTrains: true,
    regionalTrains: true,
    suburbanTrains: false,
    undergroundTrains: false,
    trams: false,
    busses: false,
    boats: false
  }
}

export function combineMeansOfTransport(first: MeansOfTransportDto, second: MeansOfTransportDto) : MeansOfTransportDto {
  return {
    highSpeedTrains: first.highSpeedTrains || second.highSpeedTrains,
    fastTrains: first.fastTrains || second.fastTrains,
    regionalTrains: first.regionalTrains || second.regionalTrains,
    suburbanTrains: first.suburbanTrains || second.suburbanTrains,
    undergroundTrains: first.undergroundTrains || second.undergroundTrains,
    trams: first.trams || second.trams,
    busses: first.busses || second.busses,
    boats: first.boats || second.boats,
  }
}
