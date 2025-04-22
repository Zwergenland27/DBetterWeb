import {RouteOptionsData} from './components/route-options/route-options-data';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-parameters';

export interface ConnectionsData {
  route: RouteOptionsData
}

export function newRequest() : ConnectionsData {
  return {
    route: {
      originStation: undefined,
      meansOfTransportFirstSection: getMeansOfTransportDefault(),
      firstStopover: undefined,
      secondStopover: undefined,
      destinationStation: undefined,
      maxTransfers: 10,
      minTransferTime: 5,
    }
  }
}
