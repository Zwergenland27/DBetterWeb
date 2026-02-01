import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TrainRun, TrainRunResponse} from './contracts/responses/trainRunResponse';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainRunService {
  constructor(private http: HttpClient) { }

  get(id: string) : Observable<TrainRun> {
    return this.http.get<TrainRunResponse>(`train-runs/${id}`).pipe(
      map(trainRun => TrainRun.fromResponse(trainRun)),
    );
  }
}
