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
