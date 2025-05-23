import {TravelTime} from '../../../../common/contracts/dtos/travel-time.dto';

export interface SegmentDto {
  $type: 'transport' | 'walking';
  departureTime: TravelTime;
  arrivalTime: TravelTime
}
