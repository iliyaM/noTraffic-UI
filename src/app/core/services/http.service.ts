import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options);
  }

  post<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  delete<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);
  }

  patch<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

}
