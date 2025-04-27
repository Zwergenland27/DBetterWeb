import {MeansOfTransportParameters} from './means-of-transport-parameters';

export interface StopoverParameters {
  stationId: string;
  lengthOfStay: number;
  meansOfTransportNextSection: MeansOfTransportParameters;
}
