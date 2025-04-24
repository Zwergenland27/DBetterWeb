import {RouteOptionsData} from './components/route-options/route-options-data';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-parameters';
import {TimeOptionsData} from './components/time-options/time-options-data';

export interface ConnectionsData {
  route: RouteOptionsData,
  time: TimeOptionsData,
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
      maxTransfersValid: true,
      minTransferTime: 5,
      minTransferTimeValid: true,
    },
    time: {
      type: 'departure',
      timestamp: new Date(),
    }
  }
}
