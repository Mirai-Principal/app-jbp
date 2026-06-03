import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable, of } from 'rxjs';
import { Participante } from '../models/nuevos-participantes';

@Injectable({
  providedIn: 'root',
})
export class NuevosParticipantesService {
  //DI
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  getParticipantesPorActualizar(): Observable<Participante[]> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'getParticipantesPorActualizar';
    return this.http.get<Participante[]>(url);
  }

  actualizacionMasivaParticipantes(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'registroMasivoParticipantes';
    return this.http.get<any>(url);
  }
}