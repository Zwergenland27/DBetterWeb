import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StationDto} from './contracts/dtos/station-dto';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  findStations(query: string) : Observable<StationDto[]> {
    return this.http.get<StationDto[]>(`stations?query=${query}`);
  }
}
