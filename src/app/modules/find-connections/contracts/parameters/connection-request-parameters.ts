import {RouteParameters} from './route-parameters';
import {PassengerParameter} from './passenger-parameter';

export interface ConnectionRequestParameters {
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  passengers: PassengerParameter[];
  comfortClass: 'Second';
  route: RouteParameters;
}
