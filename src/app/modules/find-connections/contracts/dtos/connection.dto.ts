import { DemandDto } from "../../../../common/contracts/dtos/demand.dto";
import {SegmentDto} from './segment.dto';
import {OfferDto} from './offer.dto';

export interface ConnectionDto {
  id: string;
  demand: DemandDto;
  segments: SegmentDto[];
  offer: OfferDto;
}
