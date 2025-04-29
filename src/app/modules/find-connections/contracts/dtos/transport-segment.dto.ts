import { DemandDto } from "../../../../common/contracts/dtos/demand.dto";
import { SegmentDto } from "./segment.dto";
import {StopDto} from './stop.dto';
import {BikeCarriageInformationDto} from '../../../../common/contracts/dtos/bike-carriage-information.dto';
import {CateringInformationDto} from '../../../../common/contracts/dtos/catering-information.dto';
import {TransportProduct} from '../../../../common/contracts/dtos/transport-product';

export interface TransportSegmentDto extends SegmentDto {
  routeId: string;
  demand: DemandDto;
  stops: StopDto[];
  operator: string | null;
  destination: string | null;
  product: TransportProduct;
  replacementService: true | null;
  number: string;
  bikeCarriage: BikeCarriageInformationDto;
  catering: CateringInformationDto;
}
