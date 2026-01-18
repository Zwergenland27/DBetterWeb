import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Station, StationDto} from './contracts/dtos/station';
import {map, Observable} from 'rxjs';
import {ConnectionRequestParameters} from './contracts/parameters/connection-request-parameters';
import { ConnectionRequest } from './connection-request';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-parameters';
import {ComfortClass} from '../../common/contracts/dtos/comfort-class';
import {Connection, ConnectionDto} from './contracts/dtos/connection';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private REQUEST_KEY = 'connectionRequest';

  constructor(private http: HttpClient) { }

  findStations(query: string) : Observable<Station[]> {
    return this.http.get<StationDto[]>(`stations?query=${query}`);
  }

  storeRequest(id: string, request: ConnectionRequest){

    const storedRequest = {
      id: id,
      request: request
    };

    sessionStorage.setItem(this.REQUEST_KEY, JSON.stringify(storedRequest));
  }

  loadRequest(): {id: string, request: ConnectionRequest} {
    const storedJson = sessionStorage.getItem(this.REQUEST_KEY);
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
      id: crypto.randomUUID(),
      request: {
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
        },
        comfortClass: ComfortClass.Second,
        passengers: []
      }
    }
  }

  getSuggestions(id: string, mode: 'earlier' | 'normal' | 'later'): Observable<Connection[]> {
    let extension = "";
    switch(mode){
      case 'earlier': extension="/earlier"; break;
      case 'later': extension="/later"; break;
    }

    return this.http.get<ConnectionDto[]>(`requests/${id}/suggestions${extension}`).pipe(
      map(connections => connections.map(Connection.fromDto))
    );
  }

  upsertRequest(parameters: ConnectionRequestParameters, id: string): Observable<Connection[]> {
    return this.http.put<ConnectionDto[]>(`requests/${id}`, parameters).pipe(
        map(connections => connections.map(Connection.fromDto))
      );
  }
}
