import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(private http: HttpClient, private getUrlEndpointService: GetUrlEndpointService) { }

  getDasboards(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/getDasboards';
    return this.http.get<any>(url);
  }
  deleteDasboard(id: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/deleteDasboard/' + id;
    return this.http.get<any>(url);
  }
  registrarDashBoard(dash: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('marketing') + '/saveDashboard';
    return this.http.post<any>(url, dash);
  }
}
