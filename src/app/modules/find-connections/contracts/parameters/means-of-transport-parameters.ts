export interface MeansOfTransportParameters {
  highSpeedTrains: boolean;
  fastTrains: boolean;
  regionalTrains: boolean;
  suburbanTrains: boolean;
  undergrounds: boolean;
  trams: boolean;
  busses: boolean;
  boats: boolean;
}

export function getMeansOfTransportDefault() : MeansOfTransportParameters {
  return {
    highSpeedTrains: true,
    fastTrains: true,
    regionalTrains: true,
    suburbanTrains: false,
    undergrounds: false,
    trams: false,
    busses: false,
    boats: false
  }
}

export function combineMeansOfTransport(first: MeansOfTransportParameters, second: MeansOfTransportParameters) : MeansOfTransportParameters {
  return {
    highSpeedTrains: first.highSpeedTrains || second.highSpeedTrains,
    fastTrains: first.fastTrains || second.fastTrains,
    regionalTrains: first.regionalTrains || second.regionalTrains,
    suburbanTrains: first.suburbanTrains || second.suburbanTrains,
    undergrounds: first.undergrounds || second.undergrounds,
    trams: first.trams || second.trams,
    busses: first.busses || second.busses,
    boats: first.boats || second.boats,
  }
}
