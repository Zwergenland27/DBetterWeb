import {RouteOptionsData} from './components/route-options/route-options-data';
import {TimeOptionsData} from './components/time-options/time-options-data';
import {PassengerOptionsData} from './components/passenger-options/passenger-options-data';
import {ComfortClass} from './contracts/parameters/connection-request-dto';

export interface ConnectionRequest {
  route: RouteOptionsData,
  time: TimeOptionsData,
  comfortClass: ComfortClass,
  passengers: PassengerOptionsData[]
}
