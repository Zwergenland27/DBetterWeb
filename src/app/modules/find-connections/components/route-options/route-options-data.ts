import {MeansOfTransportParameters} from '../../contracts/parameters/means-of-transport-parameters';

export interface RouteOptionsData {
  originStation: RouteOptionsStationData | undefined;
  meansOfTransportFirstSection: MeansOfTransportParameters
  firstStopover: RouteOptionsStopoverData | undefined;
  secondStopover: RouteOptionsStopoverData | undefined;
  destinationStation: RouteOptionsStationData | undefined;
  maxTransfers: number;
  minTransferTime: number;
}

export interface RouteOptionsStationData {
  id: string;
  name: string;
}

export interface RouteOptionsStopoverData {
  station: RouteOptionsStationData | undefined;
  lengthOfStay: number;
  meansOfTransportNextSection: MeansOfTransportParameters
}
