import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';

import { RespAuthMsg } from '../../features/login/models/login.model';
import { GetUrlEndpointService } from '../services/get-url-endpoint.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  // estado inicial desde localStorage
  private currentUserSubject = new BehaviorSubject<RespAuthMsg | null>(
    this.getUserFromStorage()
  );

  // observable público
  currentUser$ = this.currentUserSubject.asObservable();

  currentUserSignal = signal<RespAuthMsg | null>(
    this.getUserFromStorage()
  );

  get currentUserValue(): RespAuthMsg | null {
    return this.currentUserSubject.value;
  }

  login(me: any): Observable<boolean> {

    const url = `${GetUrlEndpointService.getUrlFromEndPointName('user')}/login`;

    return this.http.post<RespAuthMsg>(url, me).pipe(
      map(resp => {

        if (resp && resp.Nombre) {

          // guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(resp));

          // actualizar estado
          this.currentUserSubject.next(resp);
          this.currentUserSignal.set(resp);

          return true;
        }

        return false;
      })
    );
  }

  getModulos(): Observable<string[]> {

    const url = `${GetUrlEndpointService.getUrlFromEndPointName('user')}/getModulosAcceso`;

    return this.http.get<string[]>(url);
  }

  getUserDetails(username: string): Observable<RespAuthMsg> {

    const url = `${GetUrlEndpointService.getUrlFromEndPointName('user')}/GetUserDetails/${username}`;

    return this.http.get<RespAuthMsg>(url);
  }

  logout(): void {
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);
    this.currentUserSignal.set(null);
  }

  private getUserFromStorage(): RespAuthMsg | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }
}