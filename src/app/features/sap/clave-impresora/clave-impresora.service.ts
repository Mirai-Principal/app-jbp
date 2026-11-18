import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';
import { Respuesta, PaginatedClaveImpresoraResponse } from './clave-impresora.model';


@Injectable({
  providedIn: 'root',
})
export class MiCuentaServices {
//DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  codigoImpresoraInsert(Username: string, Impresora : string): Observable<Respuesta> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('user') + '/codigoImpresoraInsert';
    return this.http.post<Respuesta>(url, { Username, Impresora });
  }

  codigoImpresoraUpdate(Username: string, Impresora : string): Observable<Respuesta> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('user') + '/codigoImpresoraUpdate';
    return this.http.put<Respuesta>(url, { Username, Impresora });
  }

  codigoImpresoraDelete(codigo: number): Observable<Respuesta> {
    const url = `${this.getUrlEndpointService.getUrlFromEndPointName('user')}/codigoImpresoraDelete/${codigo}`;
    return this.http.delete<Respuesta>(url);
  }

  getAllCodigoImpresora(
    pageIndex: number = 0,
    pageSize: number = 10,
    search: string = ''
  ): Observable<PaginatedClaveImpresoraResponse> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('user') + '/getAllCodigoImpresora';
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    const term = search.trim();
    if (term)
      params = params.set('search', term);

    return this.http.get<PaginatedClaveImpresoraResponse>(url, { params });
  }

}
