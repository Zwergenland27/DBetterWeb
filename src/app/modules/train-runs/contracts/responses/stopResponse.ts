import {TravelTime, TravelTimeDto} from '../../../../common/contracts/dtos/travel-time';
import {Demand, DemandDto} from '../../../../common/contracts/dtos/demand';
import {Platform, PlatformDto} from '../../../../common/contracts/dtos/platform';

export interface StopResponse {
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
  stopIndex: number,
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

  static fromResponse(response: StopResponse) {
    return new Stop(
      response.id,
      response.departureTime ? TravelTime.fromDto(response.departureTime) : null,
      response.arrivalTime ? TravelTime.fromDto(response.arrivalTime) : null,
      Demand.fromDto(response.demand),
      response.name,
      response.ril100,
      response.platform ? Platform.fromDto(response.platform) : null,
      response.isAdditional === true,
      response.isCancelled === true,
      response.isExitOnly === true,
      response.isEntryOnly === true,
      response.stopIndex
    )
  }

  public get nameWithRil100() {
    if(!this.ril100) return this.name;
    return `${this.name} [${this.ril100}]`;
  }
}
