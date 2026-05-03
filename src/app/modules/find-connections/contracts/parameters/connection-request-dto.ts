import {RouteDto} from './route-dto';
import {PassengerDto} from './passenger-dto';

export interface ConnectionRequestDto {
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  passengers: PassengerDto[];
  comfortClass: ComfortClass;
  route: RouteDto;
}

export enum ComfortClass {
  First = 'First',
  Second = 'Second',
}
