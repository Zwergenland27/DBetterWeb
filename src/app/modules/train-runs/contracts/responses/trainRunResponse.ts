import {
  LineInformation,
  LineInformationResult,
  TransportCategory
} from '../../../find-connections/contracts/dtos/segment';
import {
  BikeCarriageInformation,
  BikeCarriageInformationDto
} from '../../../../common/contracts/dtos/bike-carriage-information.dto';
import {CateringInformation, CateringInformationDto} from '../../../../common/contracts/dtos/catering-information.dto';
import {
  PassengerInformation,
  PassengerInformationResponseDto
} from '../../../find-connections/contracts/dtos/passengerInformationResponse';
import {Stop, StopResponse} from './stopResponse';

export enum TrainFormationSource {
  RealTime = 'RealTime',
  SeatingPlan = 'SeatingPlan',
  Prediction = 'Prediction',
}

export interface TrainCompositionResultDto {
  lastUpdatedAt: string;
  trainRunId: string;
  vehicles: string[],
  source: TrainFormationSource,
}

export class TrainComposition {
  constructor(
    public lastUpdatedAt: Date,
    public vehicles: string[],
    public source: TrainFormationSource,
  ){}

  static fromResponse(dto: TrainCompositionResultDto): TrainComposition {
    return new TrainComposition(
      new Date(Date.parse(dto.lastUpdatedAt)),
      dto.vehicles,
      dto.source);
  }
}

export interface TrainRunResponse {
  id: string;
  lastUpdatedAt: string;
  circulationId: string;
  operator: string | null;
  transportCategory: TransportCategory;
  line: LineInformationResult | null;
  stops: StopResponse[];
  bikeCarriage: BikeCarriageInformationDto;
  catering: CateringInformationDto;
  passengerInformation: PassengerInformationResponseDto[];
  trainComposition: TrainCompositionResultDto | null;
}

export class TrainRun {
  constructor(
    public id: string,
    public lastUpdatedAt: Date,
    public circulationId: string,
    public operator: string | null,
    public transportCategory: TransportCategory,
    public line: LineInformation | null,
    public stops: Stop[],
    public bikeCarriage: BikeCarriageInformation,
    public catering: CateringInformation,
    public passengerInformation: PassengerInformation[],
    public trainComposition: TrainComposition | null,
  ) {
  }

  static fromResponse(response: TrainRunResponse) {
    let trainComposition: TrainComposition | null = null;
    if(response.trainComposition){
      trainComposition = TrainComposition.fromResponse(response.trainComposition);
    }

    let line: LineInformation | null = null;
    if(response.line){
      line = LineInformation.fromResult(response.line)
    }

    return new TrainRun(
      response.id,
      new Date(Date.parse(response.lastUpdatedAt)),
      response.circulationId,
      response.operator,
      response.transportCategory,
      line,
      response.stops.map(Stop.fromResponse),
      BikeCarriageInformation.fromDto(response.bikeCarriage),
      CateringInformation.fromDto(response.catering),
      response.passengerInformation.map(PassengerInformation.fromDto),
      trainComposition
    )
  }
}
