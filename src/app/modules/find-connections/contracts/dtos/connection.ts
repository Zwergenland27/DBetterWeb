import {Demand, DemandDto} from "../../../../common/contracts/dtos/demand";
import {Segment, SegmentDto, TransferSegment, TransportSegment} from './segment';
import {Offer, OfferDto} from './offer';
import {TravelTime} from '../../../../common/contracts/dtos/travel-time';

export interface ConnectionDto {
  id: string;
  bahnDeUrl: string;
  demand: DemandDto;
  segments: SegmentDto[];
  offer: OfferDto | null;
}

export class Connection{
  constructor(
    public id: string,
    public bahnDeUrl: string,
    public demand: Demand,
    public segments: Segment[],
    public offer: Offer | null) {
  }

  static fromDto(dto: ConnectionDto): Connection {
    return new Connection(
      dto.id,
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

  get plannedDuration() {
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

  plannedDurationOfSegment(segmentIndex: number) {
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
}
