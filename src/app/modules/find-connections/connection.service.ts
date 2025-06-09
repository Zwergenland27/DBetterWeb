import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Station, StationDto} from './contracts/dtos/station';
import {map, Observable} from 'rxjs';
import {ConnectionRequestParameters} from './contracts/parameters/connection-request-parameters';
import {ConnectionSuggestions, ConnectionSuggestionsDto} from './contracts/dtos/connection-suggestions.dto';
import { ConnectionsData } from './connections-data';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-parameters';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private DATA_KEY = 'connectionsData';

  constructor(private http: HttpClient) { }

  findStations(query: string) : Observable<Station[]> {
    return this.http.get<StationDto[]>(`stations?query=${query}`);
  }

  storeConnectionsData(connectionsData: ConnectionsData){
    sessionStorage.setItem(this.DATA_KEY, JSON.stringify(connectionsData));
  }

  loadConnectionsData(): ConnectionsData {
    const storedJson = sessionStorage.getItem(this.DATA_KEY);
    if(storedJson != null){
      return JSON.parse(storedJson,(key, value) => {
        // Erkennen, ob der Wert wie ein ISO-Datum aussieht
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
          return new Date(value);
        }
        return value;}
      );
    }

    return {
      route: {
        originStation: undefined,
        meansOfTransportFirstSection: getMeansOfTransportDefault(),
        firstStopover: undefined,
        secondStopover: undefined,
        destinationStation: undefined,
        maxTransfers: 10,
        maxTransfersValid: true,
        minTransferTime: 5,
        minTransferTimeValid: true,
      },
      time: {
        type: 'departure',
        timestamp: new Date(),
      }
    }
  }

  getSuggestions(id: string, page: string | null): Observable<ConnectionSuggestions> {
    if(page){
      return this.http.get<ConnectionSuggestionsDto>(`connections/requests/${id}/suggestions?page=${page}`).pipe(
        map(dto => ConnectionSuggestions.fromDto(dto))
      );
    }

    return this.http.get<ConnectionSuggestionsDto>(`connections/requests/${id}/suggestions`).pipe(
        map(dto => ConnectionSuggestions.fromDto(dto))
      );
  }

  createRequest(parameters: ConnectionRequestParameters): Observable<ConnectionSuggestions> {
    return this.http.post<ConnectionSuggestionsDto>('connections/requests', parameters).pipe(
        map(dto => ConnectionSuggestions.fromDto(dto))
      );
  }
}
