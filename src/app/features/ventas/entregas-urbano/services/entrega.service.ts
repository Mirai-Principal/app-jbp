import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntregaService {

  constructor(private http: HttpClient,
    private getUrlEndpointService: GetUrlEndpointService
  ) { }


  getEntregasUrbano(entregaMe: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('entrega') + '/' + 'urbano';
    //console.log(url);
    return this.http.post<any>(url, entregaMe);
  }
  getHojaRuta(hojaRutaMe: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('entrega') + '/' + 'hojaRuta';
    return this.http.post<any>(url, hojaRutaMe);
  }
  getNumHojaRuta(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('conf') + '/' + 'getNumHojaRuta';
    return this.http.get<any>(url);
  }
}
