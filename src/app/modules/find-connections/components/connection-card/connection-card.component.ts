import {
  AfterContentChecked,
  AfterContentInit,
  Component,
  effect,
  ElementRef,
  input, NgZone, OnDestroy, OnInit, output, signal,
  viewChild,
  ViewChild
} from '@angular/core';
import { Connection, ConnectionDto } from '../../contracts/dtos/connection';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import {Segment, SegmentDto, TransferSegment, TransportSegment, WalkingSegment} from '../../contracts/dtos/segment';
import {IconComponent} from '../../../../common/icon/icon.component';
import {FloatingButtonComponent} from '../../../../common/floating-button/floating-button.component';
import {SegmentComponent} from '../segment/segment.component';
import {ComfortClass} from '../../../../common/contracts/dtos/comfort-class';
import {connect} from 'rxjs';
import {DemandDto, DemandStatus} from '../../../../common/contracts/dtos/demand';
import {ConnectionService} from '../../connection.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TrainRunService} from '../../../train-runs/train-run.service';

@Component({
  selector: 'connection-card',
  imports: [
    DatePipe,
    NgClass,
    IconComponent,
    CurrencyPipe,
    FloatingButtonComponent,
    SegmentComponent
],
  templateUrl: './connection-card.component.html',
  styleUrl: './connection-card.component.scss'
})
export class ConnectionCardComponent implements OnInit, OnDestroy {
  card = viewChild.required<ElementRef<HTMLDivElement>>("card")

  detailsOpened = false;
  connection = input.required<Connection>();
  _connection = signal<Connection | null>(null);
  comfortClass = input.required<ComfortClass>();

  arriveEarlierOnConnection = output<{
    connectionId: string,
    transferId: number,
    result: (connectionId: string) => void}>();
  departLaterOnConnection = output<{
    connectionId: string,
    transferId: number,
    result: (connectionId: string) => void}>();

  arriveEarlierLoadingIndex: number | null = null;
  departLaterLoadingIndex: number | null = null;

  arriveEarlierResults: {
    connectionId: string,
    transferId: number
  }[] = [];

  departLaterResults: {
    connectionId: string,
    transferId: number
  }[] = [];

  private subscribedTrainRuns: string[] = [];

  constructor(private ngZone: NgZone, private router: Router, private route: ActivatedRoute, private trainRunService: TrainRunService) {
    effect(() => {
      this._connection.set(this.connection());
    });

    effect(async () => {
      const connection = this._connection();
      if(connection == null) return;
      for(const segment of connection.segments){
        if(segment instanceof TransportSegment){
          this.subscribedTrainRuns.push(segment.trainRunId);
          await this.trainRunService.subscribeToTrainCompositionRealtimeFeed(segment.trainRunId, (trainComposition) => {
            this._connection.update(connection => {
              if(!connection) return null;
              connection.updateTrainComposition(segment.trainRunId, trainComposition);
              return connection;
            });
          });
        }
      }
    });
  }

  async ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
          const detailId = params.get("details")

          if(detailId === null || this._connection() === null) {
            this.detailsOpened = false;
            return;
          }

          if(detailId != this._connection()!.id && this.detailsOpened){
            this.detailsOpened = false;
            return;
          }

          if(detailId == this._connection()!.id && !this.detailsOpened){
            this.detailsOpened = true;
            const sub = this.ngZone.onStable.subscribe(() => {
              requestAnimationFrame(() => {
                this.card().nativeElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              });
              sub.unsubscribe();
            })
          }
        });
  }

  async ngOnDestroy() {
    for (const trainRunId of this.subscribedTrainRuns) {
      await this.trainRunService.unsubscribeFromTrainCompositionRealtimeFeed(trainRunId);
    }
    this.subscribedTrainRuns = [];
  }

  isTransferSegment(segment: Segment) {
    return segment instanceof TransferSegment;
  }

  isWalkingSegment(segment: Segment) {
    return segment instanceof WalkingSegment;
  }

  asWalkingSegment(segment: Segment) {
    return segment as WalkingSegment;
  }

  isTransportSegment(segment: Segment) {
    return segment instanceof TransportSegment;
  }

  asTransportSegment(segment: Segment) {
    return segment as TransportSegment;
  }

  asTransferSegment(segment: Segment) {
    return segment as TransferSegment;
  }

  get plannedTimeInformation(){
    return {
      departure: this._connection()!.departureTime.planned,
      arrival: this._connection()!.arrivalTime.planned,
    }
  }

  get realTimeInformation() {
    const departure = this._connection()!.departureTime;
    const arrival = this._connection()!.arrivalTime;

    if(!departure.real && !arrival.real) return null;

    return {
      departure: departure.real ?? departure.planned,
      departureTimingType: departure.getDelayInformation(),
      arrival: arrival.real ?? arrival.planned,
      arrivalTimingType: arrival.getDelayInformation()
    }
  }

  openOnBahnDe(){
    console.log(this._connection()!.bahnDeUrl);
    window.open(this._connection()!.bahnDeUrl, "_blank");
  }

  toggleDetails(){
    if(!this.detailsOpened){
      this.openConnectionDetails(this._connection()!.id);
    }else{
     this.closeConnectionDetails();
    }
  }

  protected readonly ComfortClass = ComfortClass;

  arriveEarlier(transferId: number) {
    this.arriveEarlierLoadingIndex = transferId;
    this.arriveEarlierOnConnection.emit({
      connectionId: this._connection()!.id,
      transferId: transferId,
      result: (connectionId: string) => {
        this.arriveEarlierResults.push({
          transferId: transferId,
          connectionId: connectionId
        });
        this.arriveEarlierLoadingIndex = null;
      }
    });
  }

  isArriveEarlierLoading(transferId: number){
    return this.arriveEarlierLoadingIndex != null && this.arriveEarlierLoadingIndex == transferId;
  }

  departLater(transferId: number) {
    this.departLaterLoadingIndex = transferId;
    this.departLaterOnConnection.emit({
      connectionId: this._connection()!.id,
      transferId: transferId,
      result: (connectionId: string) => {
        this.departLaterResults.push({
          transferId: transferId,
          connectionId: connectionId
        });
        this.departLaterLoadingIndex = null;
      }
    });
  }

  isDepartLaterLoading(transferId: number){
    return this.departLaterLoadingIndex != null && this.departLaterLoadingIndex == transferId;
  }

  isAnyArriveEarlierOrDepartLaterLoading(){
    return this.arriveEarlierLoadingIndex != null || this.departLaterLoadingIndex != null;
  }

  hasArriveEarlierRequested(transferId: number){
    return this.arriveEarlierResults.findIndex(r => r.transferId === transferId) >= 0;
  }

  hasDepartLaterRequested(transferId: number){
    return this.departLaterResults.findIndex(r => r.transferId === transferId) >= 0;
  }

  gotoConnectionWithEarlierArrival(transferId: number){
    const result = this.arriveEarlierResults.find(r => r.transferId === transferId);
    if(!result) return;

    this.openConnectionDetails(result.connectionId);
  }

  gotoConnectionWithLaterDeparture(transferId: number){
    const result = this.departLaterResults.find(r => r.transferId === transferId);
    if(!result) return;

    this.openConnectionDetails(result.connectionId);
  }

  openConnectionDetails(connectionId: string){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {details: connectionId},
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  closeConnectionDetails(){
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {details: null},
      replaceUrl: true
    });
  }
}
