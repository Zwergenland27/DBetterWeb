import { Injectable } from '@angular/core';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

export type StationDto = {
  id: string;
  rl100: string | null;
  name: string;
  extId: string;
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

    //return of(stations.filter(station => station.rl100?.includes(value) || station.name.includes(value)));
    return this.http.get<StationDto[]>(`stations?search=${value}`);
  }
}
