import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable, throwError, timer, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  // notificador de cambios
  public onDashboardsChanged = new Subject<void>();
  
  notifyDashboardsChanged() {
    this.onDashboardsChanged.next();
  }

  constructor(private http: HttpClient, private getUrlEndpointService: GetUrlEndpointService) { }

  getDasboards(userName: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/getDasboards/' + userName;
    return this.http.get<any>(url).pipe(
      map(response => {
        // Si el backend devuelve un 200 OK pero con el mensaje de error de Active Directory, forzamos un throw
        if (response && response.error && response.error.includes('0x80131014')) {
          throw new Error('AD_UNLOADED_ERROR');
        }
        return response;
      }),
      retry({
        count: 3, // Intentará hasta 3 veces
        delay: (error, retryCount) => {
          if (error.message === 'AD_UNLOADED_ERROR') {
            console.warn(`[Intento ${retryCount}/3] AppDomain desconectado. Reintentando en 1 segundo...`);
            return timer(1000); 
          }
          return throwError(() => error);
        }
      })
    );
  }
  deleteDasboard(id: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/deleteDasboard/' + id;
    return this.http.get(url, { responseType: 'text' });
  }
  registrarDashBoard(dash: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/saveDashboard';
    return this.http.post<any>(url, dash);
  }
}
