import {TravelTime} from '../../../../common/contracts/dtos/travel-time.dto';

export interface SegmentDto {
  $type: string;
  departureTime: TravelTime;
  arrivalTime: TravelTime
}
