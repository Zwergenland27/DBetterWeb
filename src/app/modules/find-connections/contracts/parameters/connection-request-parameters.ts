import {RouteParameters} from './route-parameters';
import {PassengerParameter} from './passenger-parameter';

export interface ConnectionRequestParameters {
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  passengers: PassengerParameter[];
  comfortClass: ComfortClass;
  route: RouteParameters;
}

export enum ComfortClass {
  First = 'First',
  Second = 'Second',
}
