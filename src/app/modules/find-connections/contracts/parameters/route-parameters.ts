import {MeansOfTransportParameters} from './means-of-transport-parameters';
import {StopoverParameters} from './stopover-parameters';

export interface RouteParameters {
  originStationId: string;
  meansOfTransportFirstSection: MeansOfTransportParameters;
  firstStopover: StopoverParameters | undefined;
  meansOfTransportSecondSection: MeansOfTransportParameters | undefined;
  secondStopover: StopoverParameters | undefined;
  meansOfTransportThirdSection: MeansOfTransportParameters | undefined;
  destinationStationId: string;
}
