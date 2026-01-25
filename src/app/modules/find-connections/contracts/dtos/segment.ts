import {
  BikeCarriageInformation,
  BikeCarriageInformationDto
} from "../../../../common/contracts/dtos/bike-carriage-information.dto";
import {CateringInformation, CateringInformationDto} from "../../../../common/contracts/dtos/catering-information.dto";
import {Demand, DemandDto} from "../../../../common/contracts/dtos/demand";
import {Stop, StopDto} from "./stop";
import {PassengerInformation, PassengerInformationResponseDto} from './passengerInformationResponse';

export interface SegmentDto {
  $type: 'transport' | 'transfer' | 'walking';
}

export class Segment {
  static fromDto(dto: SegmentDto): Segment {
    switch (dto.$type) {
      case 'transport': return Segment.fromTransportSegmentDto(dto as TransportSegmentDto);
      case 'transfer': return Segment.fromTransferSegmentDto(dto as TransferSegmentDto);
      case 'walking': return Segment.fromWalkingSegmentDto(dto as WalkingSegmentDto);
      default: throw new Error(`Unknown segment type: ${dto.$type}`);
    }
  }

  private static fromTransportSegmentDto(dto: TransportSegmentDto): TransportSegment {
    return new TransportSegment(
      dto.trainRunId,
      Demand.fromDto(dto.demand),
      dto.stops.map(Stop.fromDto),
      dto.operator,
      dto.destination,
      dto.transportCategory,
      dto.line,
      BikeCarriageInformation.fromDto(dto.bikeCarriage),
      CateringInformation.fromDto(dto.catering),
      dto.passengerInformation.map(PassengerInformation.fromDto)
    );
  }

  private static fromTransferSegmentDto(dto: TransferSegmentDto) : TransferSegment {
    return new TransferSegment();
  }


  private static fromWalkingSegmentDto(dto: WalkingSegmentDto): WalkingSegment {
    return new WalkingSegment(dto.distance, dto.walkDuration);
  }
}

export interface TransferSegmentDto {
  $type: 'transfer' | 'walking';
}

export class TransferSegment extends Segment {
  constructor(){
    super();
  }
}

export interface TransportSegmentDto extends SegmentDto {
  $type: 'transport';
  trainRunId: string;
  demand: DemandDto;
  stops: StopDto[];
  operator: string | null;
  destination: string | null;
  transportCategory: TransportCategory;
  line: string;
  bikeCarriage: BikeCarriageInformationDto;
  catering: CateringInformationDto;
  passengerInformation: PassengerInformationResponseDto[];
}

export enum TransportCategory {
  HighSpeedTrain = 'HighSpeedTrain',
  FastTrain = 'FastTrain',
  RegionalTrain = 'RegionalTrain',
  SuburbanTrain = 'SuburbanTrain',
  UndergroundTrain = 'UndergroundTrain',
  Tram = 'Tram',
  Bus = 'Bus',
  Boat = 'Boat',
  Replacement = 'Replacement',
}

export class TransportSegment {

  constructor(
    public trainRunId: string,
    public demand: Demand,
    public stops: Stop[],
    public operator: string | null,
    public destination: string | null,
    public transportCategory: TransportCategory,
    public line: string,
    public bikeCarriage: BikeCarriageInformation,
    public catering: CateringInformation,
    public passengerInformation: PassengerInformation[]
  ) {
  }

  get iconName(): string {
    switch (this.transportCategory) {
      case TransportCategory.HighSpeedTrain: return 'filled_train';
      case TransportCategory.FastTrain: return 'filled_train';
      case TransportCategory.RegionalTrain: return 'filled_train';
      case TransportCategory.SuburbanTrain: return 'metro';
      case TransportCategory.UndergroundTrain: return 'subway';
      case TransportCategory.Bus: return 'filled_directions_bus';
      case TransportCategory.Tram: return 'filled_tram';
      case TransportCategory.Boat: return 'filled_directions_boat';
      case TransportCategory.Replacement: return 'filled_bus_railway';
    }
  }

  get realDuration(){
    const departure = this.stops[0].departureTime!.real ?? this.stops[0].departureTime!.planned;
    const arrival = this.stops[this.stops.length - 1].arrivalTime!.real ?? this.stops[this.stops.length - 1].arrivalTime!.planned;

    const milliseconds = arrival.getTime() - departure.getTime();

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }
}

export interface WalkingSegmentDto extends TransferSegmentDto {
  distance: number;
  walkDuration: number;
}

export class WalkingSegment extends TransferSegment {
  constructor(
    public distance: number,
    public walkDuration: number
  ) {
    super();
  }

  get minutes(){
    return Math.floor(this.walkDuration / 60);
  }
}
