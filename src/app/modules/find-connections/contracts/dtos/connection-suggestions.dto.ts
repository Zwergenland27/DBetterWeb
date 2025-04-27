import {ConnectionDto} from './connection.dto';

export interface ConnectionSuggestionsDto {
  connections: ConnectionDto[],
  pageEarlier: string | undefined;
  pageLater: string | undefined;
}
