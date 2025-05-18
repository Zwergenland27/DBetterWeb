import { DemandDto } from '../../../../common/contracts/dtos/demand.dto';
import { SegmentDto } from './segment.dto';
import {StopDto} from './stop.dto';
import {BikeCarriageInformationDto} from '../../../../common/contracts/dtos/bike-carriage-information.dto';
import {CateringInformationDto} from '../../../../common/contracts/dtos/catering-information.dto';

export interface TransportSegmentDto extends SegmentDto {
  routeId: string;
  demand: DemandDto;
  stops: StopDto[];
  operator: string | null;
  destination: string | null;
  transportCategory: TransportCategory;
  replacementService: true | null;
  line: string;
  bikeCarriage: BikeCarriageInformationDto;
  catering: CateringInformationDto;
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

export function getIconName(transportCategory: TransportCategory): string {
  switch (transportCategory) {
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
