import { TravelTime } from "../../../../common/contracts/dtos/travel-time.dto";
import {DemandDto} from '../../../../common/contracts/dtos/demand.dto';
import { PlatformDto } from "../../../../common/contracts/dtos/platform.dto";

export interface StopDto {
  id: string;
  departureTime: TravelTime | undefined;
  arrivalTime: TravelTime | undefined;
  demand: DemandDto;
  name: string;
  platform: PlatformDto;
  isAdditional: true | undefined;
  isCancelled: true | undefined;
  isExitOnly: true | undefined;
  isEntryOnly: true | undefined;
  stopIndex: number;
}
