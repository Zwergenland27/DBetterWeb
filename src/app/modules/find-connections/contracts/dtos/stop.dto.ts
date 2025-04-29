import { TravelTime } from "../../../../common/contracts/dtos/travel-time.dto";
import {DemandDto} from '../../../../common/contracts/dtos/demand.dto';
import { PlatformDto } from "../../../../common/contracts/dtos/platform.dto";

export interface StopDto {
  id: string;
  departureTime: TravelTime | null;
  arrivalTime: TravelTime | null;
  demand: DemandDto;
  name: string;
  platform: PlatformDto;
  isAdditional: true | null;
  isCancelled: true | null;
  isExitOnly: true | null;
  isEntryOnly: true | null;
  stopIndex: number;
}
