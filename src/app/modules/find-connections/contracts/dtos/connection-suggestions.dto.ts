import {ConnectionDto} from './connection.dto';

export interface ConnectionSuggestionsDto {
  connections: ConnectionDto[],
  pageEarlier: string | null;
  pageLater: string | null;
}
