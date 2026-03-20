import {Injectable, OnDestroy} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RealtimeNotificationsService implements OnDestroy {

  private connection: signalR.HubConnection;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}rt/trainCompositions`)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();
  }

  private connect(): Promise<void> {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = this.connection.start();
    return this.connectionPromise;
  }

  async subscribe<T>(method: string, topic: string, handler: (data: T) => void): Promise<void> {
    await this.connect();
    this.connection.on(method, handler);
    await this.connection.invoke("Subscribe", topic);
  }

  async unsubscribe(method: string, topic: string) {
    this.connection.off(method);
    await this.connection.invoke("Unsubscribe", method);
  }

  ngOnDestroy(): void {
    this.connection.stop();
  }
}
