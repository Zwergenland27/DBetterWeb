import {TravelTime, TravelTimeDto} from "../../../../common/contracts/dtos/travel-time";
import {Demand, DemandDto} from '../../../../common/contracts/dtos/demand';
import {Platform, PlatformDto} from "../../../../common/contracts/dtos/platform";

export interface StopDto {
  id: string;
  departureTime: TravelTimeDto | null;
  arrivalTime: TravelTimeDto | null;
  demand: DemandDto;
  name: string;
  ril100: string | null;
  platform: PlatformDto | null;
  isAdditional: true | null;
  isCancelled: true | null;
  isExitOnly: true | null;
  isEntryOnly: true | null;
  stopIndex: number;
}

export class Stop {
  constructor(
    public id: string,
    public departureTime: TravelTime | null,
    public arrivalTime: TravelTime | null,
    public demand: Demand,
    public name: string,
    public ril100: string | null,
    public platform: Platform | null,
    public isAdditional: boolean,
    public isCancelled: boolean,
    public isExitOnly: boolean,
    public isEntryOnly: boolean,
    public stopIndex: number,
  ) {
  }

  static fromDto(dto: StopDto): Stop {
    return new Stop(
      dto.id,
      dto.departureTime ? TravelTime.fromDto(dto.departureTime) : null,
      dto.arrivalTime ? TravelTime.fromDto(dto.arrivalTime) : null,
      Demand.fromDto(dto.demand),
      dto.name,
      dto.ril100,
      dto.platform ? Platform.fromDto(dto.platform) : null,
      dto.isAdditional === true,
      dto.isCancelled === true,
      dto.isExitOnly === true,
      dto.isEntryOnly === true,
      dto.stopIndex
    );
  }
}
