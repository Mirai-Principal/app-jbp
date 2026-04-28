import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { ReaccionesReporteResponse } from '../models/reacciones-reporte.model';

@Injectable({
  providedIn: 'root',
})
export class ReaccionesReporteService {
  //DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);



  getReacciones(): Observable<ReaccionesReporteResponse[]> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('reacciones');
    return this.http.get<ReaccionesReporteResponse[]>(url!);
  }

}
