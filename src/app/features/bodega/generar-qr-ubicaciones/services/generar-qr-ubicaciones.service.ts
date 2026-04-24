import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class GenerarQrUbicacionesService {
  hojaRuta: any;

  constructor(
    private http: HttpClient,
    private getUrlEndpointService: GetUrlEndpointService
  ) { }

  getSubniveles(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('bodega') + '/getSubnivelesAlmacen';
    return this.http.get<any>(url);
  }
  /**
   Ej. si token es 'NIVEL' -> trae los niveles
   Ej. si token es 'PERCHA' -> trae las perchas
   */

  getNivelesByTocken(subniveles: any[], token: string) {
    let ms: any[] = [];
    subniveles.forEach(sb => {
      if (sb.descripcion.indexOf(token) == 0) // si contiene el token (percha, nivel, seccion)
        ms.push(sb);
    });
    return ms;
  }
  getContenidoUbicacion(ubicacion: string) {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('bodega') + '/consultaubicacion/' + ubicacion;
    console.log(url);
    return this.http.get<any>(url);
  }
  getContenidoLote(lote: string, codArticulo?: string) {
    let url = this.getUrlEndpointService.getUrlFromEndPointName('bodega') + '/getUbicacionesYDetArticuloPorLote/' + lote;
    if (codArticulo)
      url += '/' + codArticulo;
    return this.http.get<any>(url);
  }
}

