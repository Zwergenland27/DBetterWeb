import { Injectable } from '@angular/core';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export type StationDto = {
  id: string;
  rl100: string | null;
  name: string;
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  public getStationSuggestions(value: string | null) {
    if(!value || value.length < 1){
      return of([]);
    }
    const stations : StationDto[] = [
      {id: '0', rl100: 'DH', name: 'Dresden Hbf', lat: 0, lon: 0},
      {id: '1', rl100: 'DN', name: 'Dresden Neustadt', lat: 0, lon: 0},
      {id: '2', rl100: 'FF', name: 'Frankfurt Hbf', lat: 0, lon: 0},
    ];

    return of(stations.filter(station => station.rl100?.includes(value) || station.name.includes(value)));
    //return this.http.get<StationDto[]>(`stations?search=${value}`);
  }
}
