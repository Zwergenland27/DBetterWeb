import {TransportCategory} from '../../../find-connections/contracts/dtos/segment';
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
import {catchError} from 'rxjs';

export interface TrainRunResponse {
  id: string;
  circulationId: string;
  operator: string | null;
  transportCategory: TransportCategory;
  line: string | null;
  stops: StopResponse[];
  serviceNumber: number | null;
  bikeCarriage: BikeCarriageInformationDto;
  catering: CateringInformationDto;
  passengerInformation: PassengerInformationResponseDto[];
}

export class TrainRun {
  constructor(
    public id: string,
    public circulationId: string,
    public operator: string | null,
    public transportCategory: TransportCategory,
    public line: string | null,
    public stops: Stop[],
    public serviceNumber: number | null,
    public bikeCarriage: BikeCarriageInformation,
    public catering: CateringInformation,
    public passengerInformation: PassengerInformation[]
  ) {
  }

  static fromResponse(response: TrainRunResponse) {
    return new TrainRun(
      response.id,
      response.circulationId,
      response.operator,
      response.transportCategory,
      response.line,
      response.stops.map(Stop.fromResponse),
      response.serviceNumber,
      BikeCarriageInformation.fromDto(response.bikeCarriage),
      CateringInformation.fromDto(response.catering),
      response.passengerInformation.map(PassengerInformation.fromDto)
    )
  }
}
