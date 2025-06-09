import {Connection, ConnectionDto} from './connection';

export interface ConnectionSuggestionsDto {
  requestId: string;
  connections: ConnectionDto[],
  pageEarlier: string | null;
  pageLater: string | null;
}

export class ConnectionSuggestions {
  constructor(
    public requestId: string,
    public connections: Connection[],
    public pageEarlier: string | null,
    public pageLater: string | null
  ) {}

  static fromDto(dto: ConnectionSuggestionsDto): ConnectionSuggestions {
    return new ConnectionSuggestions(
      dto.requestId,
      dto.connections.map(Connection.fromDto),
      dto.pageEarlier,
      dto.pageLater
    );
  }
}