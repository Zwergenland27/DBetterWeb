import {MeansOfTransportDto} from './means-of-transport-dto';

export interface StopoverDto {
  stationId: string;
  lengthOfStay: number;
  meansOfTransportNextSection: MeansOfTransportDto;
}
