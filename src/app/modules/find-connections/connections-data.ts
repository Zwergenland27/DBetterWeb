import {RouteOptionsData} from './components/route-options/route-options-data';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-parameters';
import {TimeOptionsData} from './components/time-options/time-options-data';

export interface ConnectionsData {
  route: RouteOptionsData,
  time: TimeOptionsData,
}
