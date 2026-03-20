import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  TrainComposition,
  TrainCompositionResultDto,
  TrainRun,
  TrainRunResponse
} from './contracts/responses/trainRunResponse';
import {map, Observable} from 'rxjs';
import {RealtimeNotificationsService} from '../../common/realtime-notifications.service';

@Injectable({
  providedIn: 'root'
})
export class TrainRunService {
  constructor(private http: HttpClient, private rtService: RealtimeNotificationsService) { }

  get(id: string) : Observable<TrainRun> {
    return this.http.get<TrainRunResponse>(`train-runs/${id}`).pipe(
      map(trainRun => TrainRun.fromResponse(trainRun)),
    );
  }

  async subscribeToTrainCompositionRealtimeFeed(id: string, handler: (trainComposition: TrainComposition) => void){
    await this.rtService.subscribe<TrainCompositionResultDto>("Update", id, (trainComposition) => {
      if(trainComposition.trainRunId !== id) return;
      handler(TrainComposition.fromResponse(trainComposition));
    });
  }

  async unsubscribeFromTrainCompositionRealtimeFeed(id: string){
    await this.rtService.unsubscribe("Update", id);
  }
}
