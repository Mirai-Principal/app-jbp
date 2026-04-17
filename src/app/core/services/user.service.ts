import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap } from 'rxjs';

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
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  getModulos(): Observable<string[]> {
    let url = this.getUrlEndpointService.getUrlFromEndPointName('user')
    url += '/getModulosAcceso';
    return this.http.get<any>(url as string);
  }

  login(me: LoginMsg): Observable<boolean> {
    console.log(me);

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