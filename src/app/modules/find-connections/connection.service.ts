import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Station, StationDto} from './contracts/dtos/station';
import {map, Observable} from 'rxjs';
import {ConnectionRequestDto} from './contracts/parameters/connection-request-dto';
import { ConnectionRequest } from './connection-request';
import {getMeansOfTransportDefault} from './contracts/parameters/means-of-transport-dto';
import {ComfortClass} from '../../common/contracts/dtos/comfort-class';
import {Connection, ConnectionResultDto} from './contracts/dtos/connection';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private REQUEST_KEY = 'connectionRequest';

  constructor(private http: HttpClient) { }

  findStations(query: string) : Observable<Station[]> {
    return this.http.get<StationDto[]>(`stations?query=${query}`).pipe(
      map(stations => stations.map(Station.fromDto))
    );
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

    return this.http.get<ConnectionResultDto[]>(`requests/${id}/suggestions${extension}`).pipe(
      map(connections => connections.map(Connection.fromResult))
    );
  }

  arriveEarlier(requestId: string, connectionId: string, transferIndex: number) : Observable<Connection> {
    return this.http.get<ConnectionResultDto>(`requests/${requestId}/suggestions/${connectionId}/transfers/${transferIndex}/arriveEarlier`).pipe(
      map(connection => Connection.fromResult(connection)),
    );
  }

  departLater(requestId: string, connectionId: string, transferIndex: number) : Observable<Connection> {
    return this.http.get<ConnectionResultDto>(`requests/${requestId}/suggestions/${connectionId}/transfers/${transferIndex}/departLater`).pipe(
      map(connection => Connection.fromResult(connection)),
    );
  }

  upsertRequest(parameters: ConnectionRequestDto, id: string): Observable<Connection[]> {
    return this.http.put<ConnectionResultDto[]>(`requests/${id}`, parameters).pipe(
        map(connections => connections.map(Connection.fromResult))
      );
  }
}
