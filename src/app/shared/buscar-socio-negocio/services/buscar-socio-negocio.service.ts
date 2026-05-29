import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUrlEndpointService } from '../../../core/services/get-url-endpoint.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SocioNegocioItem } from '../models/buscar-socio-negocio.model';


@Injectable({
  providedIn: 'root',
})
export class BuscarSocioNegocioService {

  // DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);


  buscarSocioNegocio(token: string): Observable<SocioNegocioItem[]> {
    if (token && token !== '') {
      let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
      url += '/getItemsByToken/' + token;
      //? retorna solo los que tienen ParticipantePlanPuntos
      return this.http.get<SocioNegocioItem[]>(url as string).pipe(
        map((clientes: SocioNegocioItem[]) => clientes.filter(cliente => cliente.ParticipantePlanPuntos))
      );
    }
    return new Observable<SocioNegocioItem[]>();
  }
}
