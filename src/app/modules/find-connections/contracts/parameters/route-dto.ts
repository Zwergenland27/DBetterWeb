import {MeansOfTransportDto} from './means-of-transport-dto';
import {StopoverDto} from './stopover-dto';

export interface RouteDto {
  originStationId: string;
  meansOfTransportFirstSection: MeansOfTransportDto;
  firstStopover: StopoverDto | undefined;
  secondStopover: StopoverDto | undefined;
  destinationStationId: string;
  maxTransfers: number,
  minTransferTime: number,
}
