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
    return this.http.get<StationDto[]>(`stations?search=${value}`);
  }
}
