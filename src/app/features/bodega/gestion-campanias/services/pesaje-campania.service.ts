import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Campania, CampaniaDetalles, ST_ComponentesMsg } from '../models/models';


@Injectable({
  providedIn: 'root',
})
export class PesajeCampaniaService {
  // DI
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private http = inject(HttpClient);

  buscarOF(DocNum: number): Observable<any> {
    const url = `${this.getUrlEndpointService.backend_api}/of/getOrdenFab/${DocNum}`;
    return this.http.get<any>(url);
  }

  crearCampania(datos: any): Observable<any> {
    const url = `${this.getUrlEndpointService.backend_api}/of/campania/create`;
    return this.http.post<any>(url, datos);
  }

  listaCampanias(): Observable<Campania[]> {
    const url = `${this.getUrlEndpointService.backend_api}/of/campania/list`;
    return this.http.get<Campania[]>(url);
  }

  obtenerCampania(id: number): Observable<CampaniaDetalles[]> {
    const url = `${this.getUrlEndpointService.backend_api}/of/campania/${id}`;
    return this.http.get<CampaniaDetalles[]>(url);
  }

  obtenerDetallesST(idST: number): Observable<ST_ComponentesMsg[]> {
    const url = `${this.getUrlEndpointService.backend_api}/st/GetComponetesConLotesById/${idST}`;
    return this.http.get<ST_ComponentesMsg[]>(url);
  }

  eliminarCampania(id: number): Observable<any> {
    const url = `${this.getUrlEndpointService.backend_api}/of/campania/${id}`;
    return this.http.delete<any>(url);
  }
}
