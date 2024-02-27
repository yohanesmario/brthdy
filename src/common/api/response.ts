export interface Response<T> {
  result?: T;
  statusCode?: number;
  message?: string;
}
