import { inject, Injectable } from '@angular/core';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaLoteResponse } from '../models/consulta-lote.model';


@Injectable({
  providedIn: 'root',
})
export class ConsultaLoteService {
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);


  getContenidoLote(lote: string, codArticulo?: string): Observable<ConsultaLoteResponse> {

    let url = this.getUrlEndpointService.getUrlFromEndPointName('bodega') + '/getUbicacionesYDetArticuloPorLote/' + lote;
    if (codArticulo)
      url += '/' + codArticulo;
    return this.http.get<ConsultaLoteResponse>(url);
  }
}
