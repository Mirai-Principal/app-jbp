import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActualizarParticipantesService {
  //DI
  private http = inject(HttpClient);
  private getUrlEndpointService = inject(GetUrlEndpointService);

  getParticipantesPorActualizar(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'getParticipantesPorActualizar';
    return this.http.get<any>(url);
  }

  actualizacionMasivaParticipantes(): Observable<any> {
    const url = this.getUrlEndpointService.getUrlFromEndPointName('promotick') + '/' + 'actualizacionMasivaParticipantes';
    return this.http.get<any>(url);
  }

}
