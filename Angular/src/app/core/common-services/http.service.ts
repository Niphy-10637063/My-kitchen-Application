import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HTTP_REQUEST_OPTION_OBSERVE, HTTP_REQUEST_OPTION_RESPONSE_TYPE } from '../invariables/enums';
import { Observable } from 'rxjs';
export interface HttpRequestOptions {
  headers?: HttpHeaders;
  observe?: HTTP_REQUEST_OPTION_OBSERVE;
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: HTTP_REQUEST_OPTION_RESPONSE_TYPE;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public get<T>(uri: string, timeout?: number, options?: HttpRequestOptions): Observable<any> {
    const modifiedOptions: any = this.processOptions(timeout, options);
    return this.http.get<T>(uri, modifiedOptions);
  }

  public post<T>(uri: string, body: any | null, timeout?: number, options?: HttpRequestOptions): Observable<any> {
    const modifiedOptions: any = this.processOptions(timeout, options);
    return this.http.post<T>(uri, body, modifiedOptions);
  }

  public put<T>(uri: string, body: any | null, timeout?: number, options?: HttpRequestOptions): Observable<any> {
    const modifiedOptions: any = this.processOptions(timeout, options);
    return this.http.put<T>(uri, body, modifiedOptions);
  }

  public delete<T>(uri: string, timeout?: number, options?: HttpRequestOptions): Observable<any> {
    const modifiedOptions: any = this.processOptions(timeout, options);
    return this.http.delete<T>(uri, modifiedOptions);
  }

  private processOptions(timeout: number | undefined, options: HttpRequestOptions | undefined): any {
    // Declare and initialize variable to store processed options
    const modifiedOptions: any = {
      headers: (options === undefined) ? undefined : options.headers,
      observe: 'response',
      params: (options === undefined) ? undefined : options.params,
      reportProgress: (options === undefined) ? undefined : options.reportProgress,
      responseType: 'json',
      withCredentials: (options === undefined) ? undefined : options.withCredentials
    };

    // Add our custom timeout for interceptor to handle
    this.addTimeoutToOptions(timeout, modifiedOptions);

    if (options !== undefined) {
      // Add appropriate 'observe' value
      switch (options.observe) {
        case HTTP_REQUEST_OPTION_OBSERVE.body:
          modifiedOptions.observe = 'body';
          break;
        case HTTP_REQUEST_OPTION_OBSERVE.events:
          modifiedOptions.observe = 'events';
          break;
        case HTTP_REQUEST_OPTION_OBSERVE.response:
          modifiedOptions.observe = 'response';
          break;
      }

      // Add appropriate 'responseType' value
      switch (options.responseType) {
        case HTTP_REQUEST_OPTION_RESPONSE_TYPE.arrayBuffer:
          modifiedOptions.responseType = 'arrayBuffer';
          break;
        case HTTP_REQUEST_OPTION_RESPONSE_TYPE.blob:
          modifiedOptions.responseType = 'blob';
          break;
        case HTTP_REQUEST_OPTION_RESPONSE_TYPE.json:
          modifiedOptions.responseType = 'json';
          break;
        case HTTP_REQUEST_OPTION_RESPONSE_TYPE.text:
          modifiedOptions.responseType = 'text';
          break;
      }
    }

    return modifiedOptions;
  }

  private addTimeoutToOptions(timeout: number | undefined, options: any | undefined): any {
    const requestTimeout: number = (timeout === undefined) ? 60000 : timeout;

    if (options === undefined) {
      options = { headers: new HttpHeaders({ timeout: requestTimeout.toString() }) };
    } else if (options.headers === undefined) {
      options.headers = new HttpHeaders({ timeout: requestTimeout.toString() });
    } else if (!options.headers.has('timeout')) {
      options.headers = options.headers.set('timeout', requestTimeout.toString());
    }

    return options;
  }
}
