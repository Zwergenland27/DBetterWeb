import {MeansOfTransportParameters} from './means-of-transport-parameters';
import {StopoverParameters} from './stopover-parameters';

export interface RouteParameters {
  originStationId: string;
  meansOfTransportFirstSection: MeansOfTransportParameters;
  firstStopover: StopoverParameters | undefined;
  secondStopover: StopoverParameters | undefined;
  destinationStationId: string;
  maxTransfers: number,
  minTransferTime: number,
}
