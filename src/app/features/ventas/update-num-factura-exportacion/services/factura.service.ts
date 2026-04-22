import { Injectable } from '@angular/core';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {


  constructor(private getUrlEndpointService: GetUrlEndpointService, private http: HttpClient) { }

  setNumFacturaExportacion(me: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('factura') + '/' + 'updateFolioFactExportacion';
    //console.log(url);
    return this.http.post<any>(url, me);
  }
  getFacturasHistoricas(me: any): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('facturaHistorico') + '/' + 'getFacturasByCliente';
    console.log(url);
    return this.http.post<any>(url, me);
  }

}
