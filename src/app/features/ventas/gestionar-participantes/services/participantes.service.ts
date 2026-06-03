import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable, of } from 'rxjs';
import { EstadoCuenta, Participante } from '../models/participantes';

@Injectable({
  providedIn: 'root',
})
export class ParticipantesService {
  //DI
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  getParticipantesPorActualizar(): Observable<Participante[]> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'getParticipantesPorActualizar';
    return this.http.get<Participante[]>(url);
  }

  getEstadoCuentaPromotick(ruc: string): Observable<EstadoCuenta> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'getEstadoCuenta/' + ruc;
    return this.http.get<EstadoCuenta>(url);
  }

  registrarParticipantePorRuc(ruc: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'registrarParticipantePorRuc';
    return this.http.post<any>(url, { ruc });
  }
  actualizarParticipantePorRuc(ruc: string): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'actualizarParticipantePorRuc';
    return this.http.post<any>(url, { ruc });
  }
}