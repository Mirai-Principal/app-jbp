import { inject, Injectable } from '@angular/core';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface UbicacionItem {
  Lote: string;
  Bodega: string;
  CodBodega: string;
  CodArticulo: string;
  Articulo: string;
  Cantidad: number;
}

export interface ConsultaUbicacionResponse {
  Items: UbicacionItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ConsultarUbicacionService {
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private http = inject(HttpClient);

  getContenidoUbicacion(ubicacion: string): Observable<ConsultaUbicacionResponse> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('bodega') + '/consultaubicacion/' + ubicacion;
    console.log(url);
    return this.http.get<ConsultaUbicacionResponse>(url);
  }


}
