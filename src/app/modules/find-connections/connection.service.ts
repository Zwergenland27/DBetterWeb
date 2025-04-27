import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {StationDto} from './contracts/dtos/station.dto';
import {Observable} from 'rxjs';
import {ConnectionRequestParameters} from './contracts/parameters/connection-request-parameters';
import {ConnectionSuggestionsDto} from './contracts/dtos/connection-suggestions.dto';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private http: HttpClient) { }

  findStations(query: string) : Observable<StationDto[]> {
    return this.http.get<StationDto[]>(`stations?query=${query}`);
  }

  getSuggestions(parameters: ConnectionRequestParameters): Observable<ConnectionSuggestionsDto> {
    return this.http.post<ConnectionSuggestionsDto>('connections/suggestions', parameters);
  }
}
