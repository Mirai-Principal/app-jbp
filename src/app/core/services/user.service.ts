import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, throwError } from 'rxjs';
import { map, tap, retry } from 'rxjs/operators';

import { GetUrlEndpointService } from '../services/get-url-endpoint.service';
import { LoginMsg, RespAuthMsg } from '../models/loginMsg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<RespAuthMsg>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private getUrlEndpointService: GetUrlEndpointService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getModulos(): Observable<string[]> {
    let url = this.getUrlEndpointService.getUrlFromEndPointName('user')
    url += '/getDepartamentos/';
    return this.http.get<any>(url as string).pipe(
      map(response => {
        if (response && response.error && typeof response.error === 'string' && response.error.includes('0x80131014')) {
          throw new Error('AD_UNLOADED_ERROR');
        }
        return response;
      }),
      retry({
        count: 3,
        delay: (error, retryCount) => {
          if (error.message === 'AD_UNLOADED_ERROR') {
            console.warn(`[Intento ${retryCount}/3] (getModulos) AppDomain desconectado. Reintentando en 1 segundo...`);
            return timer(1000); 
          }
          return throwError(() => error);
        }
      })
    );
  }

  login(me: LoginMsg): Observable<boolean> {
    let url: String | null = this.getUrlEndpointService.getUrlFromEndPointName('user')
    url += '/login';
    console.log(url);
    return this.http.post<RespAuthMsg>(url as string, me)
      .pipe(// permite transformar el tipo de dato de retorno del observable
        map(resp => {
          console.log(resp);
          if (resp && (resp as any).Nombre) {
            localStorage.setItem('Nombre', (resp as any).Nombre);
            localStorage.setItem('currentUser', JSON.stringify(resp));
            // this.auth.isLoged = true;
            this.currentUserSubject.next(resp as RespAuthMsg);
            return true;
          }
          return false;
        })
      );
  }
  getUserDetails(username: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('user') + '/GetUserDetails/' + username;
    return this.http.get<any>(url);
  }
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('Nombre');
    this.currentUserSubject.next({} as RespAuthMsg);
  }
}