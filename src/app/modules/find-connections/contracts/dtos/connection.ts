import {Demand, DemandDto} from "../../../../common/contracts/dtos/demand";
import {Segment, SegmentDto, TransferSegment, TransportSegment} from './segment';
import {Offer, OfferDto} from './offer';
import {TravelTime} from '../../../../common/contracts/dtos/travel-time';
import {TrainComposition, TrainCompositionResultDto} from '../../../train-runs/contracts/responses/trainRunResponse';

export interface ConnectionDto {
  id: string;
  differentOrigin: boolean;
  differentDestination: boolean;
  bahnDeUrl: string;
  demand: DemandDto;
  segments: SegmentDto[];
  offer: OfferDto | null;
}

export class Connection{
  constructor(
    public id: string,
    public differentOrigin: boolean,
    public differentDestination: boolean,
    public bahnDeUrl: string,
    public demand: Demand,
    public segments: Segment[],
    public offer: Offer | null) {
  }

  static fromDto(dto: ConnectionDto): Connection {
    return new Connection(
      dto.id,
      dto.differentOrigin,
      dto.differentDestination,
      dto.bahnDeUrl,
      Demand.fromDto(dto.demand),
      dto.segments.map(Segment.fromDto),
      dto.offer ? Offer.fromDto(dto.offer) : null,
    );
  }

  get departureTime(): TravelTime {
    const firstSegment = this.segments[0] as TransportSegment;
    return firstSegment.stops[0].departureTime!;
  }

  get arrivalTime(): TravelTime {
    const lastSegment = this.segments[this.segments.length - 1] as TransportSegment;
    return lastSegment.stops[lastSegment.stops.length - 1].arrivalTime!;
  }

  get realDuration() {
    const departure = this.departureTime.real ?? this.departureTime.planned;
    const arrival = this.arrivalTime.real ?? this.arrivalTime.planned;

    const milliseconds = arrival.getTime() - departure.getTime();

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (60000));
    return {
      hours: hours,
      minutes: minutes
    };
  }

  get numberOfTransfers() {
    return this.segments.filter(s => s instanceof TransferSegment).length;
  }

  getTransferDuration(segmentIndex: number){
    const segment = this.segments[segmentIndex];
    if(!(segment instanceof TransferSegment)) throw new Error(`Segment index ${segmentIndex} is no transfer segment`);

    const previousSegment = this.segments[segmentIndex - 1] as TransportSegment;
    const nextSegment = this.segments[segmentIndex + 1] as TransportSegment;

    const lastStop = previousSegment.stops[previousSegment.stops.length - 1];
    const nextStop = nextSegment.stops[0];

    const arrival = lastStop.arrivalTime!.real ?? lastStop.arrivalTime!.planned;
    const departure = nextStop.departureTime!.real ?? nextStop.departureTime!.planned;

    let milliseconds = departure.getTime() - arrival.getTime();
    let passed = false;
    if(milliseconds < 0){
      milliseconds *= -1;
      passed = true;
    }

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (60000));
    return {
      passed: passed,
      hours: hours,
      minutes: minutes
    };
  }

  calculateSegmentPercentage(segmentIndex: number) {
    const totalDeparture = this.departureTime.real ?? this.departureTime.planned;
    const totalArrival = this.arrivalTime.real ?? this.arrivalTime.planned;

    const totalMilliseconds = totalArrival.getTime() - totalDeparture.getTime();

    const segment = this.segments[segmentIndex];

    if(segment instanceof TransportSegment){
      const departure = segment.stops[0].departureTime!.planned;
      const arrival = segment.stops[segment.stops.length - 1].arrivalTime!.planned;

      const milliseconds = arrival.getTime() - departure.getTime();
      return (milliseconds / totalMilliseconds) * 100;
    }

    const previousSegment = this.segments[segmentIndex - 1] as TransportSegment;
    const nextSegment = this.segments[segmentIndex + 1] as TransportSegment;

    const departure = previousSegment.stops[previousSegment.stops.length - 1].arrivalTime!.planned;
    const arrival = nextSegment.stops[0].departureTime!.planned;

    const milliseconds = arrival.getTime() - departure.getTime();
    return (milliseconds / totalMilliseconds) * 100;
  }

  updateTrainComposition(trainRunId: string, trainComposition: TrainComposition) {
    for(const segment of this.segments) {
      if(segment instanceof TransportSegment && segment.trainRunId == trainRunId){
        segment.trainComposition = trainComposition;
        console.log(`Updating transport segment ${trainRunId}:`, trainComposition);
      }
    }
  }
}
