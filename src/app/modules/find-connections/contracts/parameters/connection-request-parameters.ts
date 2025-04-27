import {RouteParameters} from './route-parameters';

export interface ConnectionRequestParameters {
  departureTime: string | undefined;
  arrivalTime: string | undefined;
  passengers: [];
  comfortClass: 'Second';
  route: RouteParameters;
}
