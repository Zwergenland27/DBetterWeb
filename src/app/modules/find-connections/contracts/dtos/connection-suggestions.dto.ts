import {ConnectionDto} from './connection.dto';

export interface ConnectionSuggestionsDto {
  requestId: string;
  connections: ConnectionDto[],
  pageEarlier: string | null;
  pageLater: string | null;
}
