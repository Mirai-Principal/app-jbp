import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerarPesajeCampaniaService {
  // DI
  private getUrlEndpointService = inject(GetUrlEndpointService);
  private http = inject(HttpClient);

  buscarOF(DocNum: number): Observable<any> {
    const url = `${this.getUrlEndpointService.backend_api}/of/getOrdenFab/${DocNum}`;
    return this.http.get<any>(url);
  }

  crearCampania(datos: any): Observable<any> {
    const url = `${this.getUrlEndpointService.backend_api}/of/crearCampania`;
    return this.http.post<any>(url, datos);
  }
}
