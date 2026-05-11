import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUrlEndpointService } from '../../../../core/services/get-url-endpoint.service';
import { map, Observable, Subject } from 'rxjs';
import { ItemMsg, SavedME } from '../../../../core/models/common.msg'
import { SocioNegocioItem, ParticipantePuntosMsg } from '../../../../core/models/socioNegocioMsg'

@Injectable({
  providedIn: 'root',
})
export class SocioNegocioService {
  // DI
  private readonly http = inject(HttpClient);
  private readonly getUrlEndpointService = inject(GetUrlEndpointService);

  _selectSocioNegocio: Subject<string> = new Subject<string>();

  selectSocioNegocio(ruc: string) {
    this._selectSocioNegocio.next(ruc);
  }

  onSocioNegocioSelected(): Observable<string> {
    return this._selectSocioNegocio.asObservable();
  }

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

  getHistoricoClientes(cliente: string): Observable<any> {
    if (cliente && cliente !== '') {
      let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
      url += '/getHistoricoClientesByNombre/' + cliente;
      //? retorna el historico de clientes
      return this.http.get<any>(url as string);
    }
    return new Observable<any>();
  }

  getParticipanteByRuc(ruc: string): Observable<any> {
    if (ruc && ruc !== '') {
      let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
      url += '/getParticipanteByRuc/' + ruc;
      //? retorna el participante por ruc
      return this.http.get<any>(url as string);
    }
    return new Observable<any>();
  }

  getParticipanteByRucFromERP(ruc: string): Observable<ParticipantePuntosMsg> {
    if (ruc && ruc !== '') {
      let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
      url += '/getParticipanteByRucFromERP/' + ruc;
      //? retorna el participante por ruc desde el ERP
      return this.http.get<ParticipantePuntosMsg>(url as string);
    }
    return new Observable<ParticipantePuntosMsg>();
  }

  getVendedores(): Observable<ItemMsg[]> {
    let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
    url += '/getVendedores';
    //? retorna los vendedores
    return this.http.get<ItemMsg[]>(url as string);
  }

  Save(me: ParticipantePuntosMsg): Observable<SavedME> {
    if (me) {
      let url = this.getUrlEndpointService.getUrlFromEndPointName('socioNegocio');
      url += '/SaveParticipante';
      //? guarda el participante
      return this.http.post<SavedME>(url as string, me);
    }
    return new Observable<SavedME>();
  }
}
