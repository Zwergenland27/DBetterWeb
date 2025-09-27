import {RouteOptionsData} from './components/route-options/route-options-data';
import {TimeOptionsData} from './components/time-options/time-options-data';
import {PassengerData} from './components/passenger-options/passenger-data';

export interface ConnectionsData {
  route: RouteOptionsData,
  time: TimeOptionsData,
  passengers: PassengerData[]
}
