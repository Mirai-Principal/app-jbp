import { Injectable } from '@angular/core';
import {SocioNegocioItem, ParticipantePuntosMsg} from '../msg/socioNegocioMsg';
import { UrlServices } from '../global';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { ItemMsg, SavedME } from '../msg/common.msg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class SocioNegocioService{
    _selectSocioNegocio: Subject<string>=new Subject<string>();
    constructor(private http: HttpClient){}
    selectSocioNegocio(ruc){
      this._selectSocioNegocio.next(ruc);
    }
    onSocioNegocioSelected():Observable<string>{
      return this._selectSocioNegocio.asObservable();
    }
    buscarSocioNegocio(token: string): Observable<SocioNegocioItem[]>{
      if(token && token !== ''){
        let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
        url+='/getItemsByToken/' + token;
        return this.http.get<SocioNegocioItem[]>(url);
      }
    }
    getHistoricoClientes(cliente): Observable<any>{
      let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
      url+='/getHistoricoClientesByNombre/' + cliente;
      return this.http.get<any>(url);
    }
    getParticipanteByRuc(ruc: string): Observable<any>{
      if (ruc && ruc !== '') {
        let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
        url+='/getParticipanteByRuc/' + ruc;
        //const url = UrlServices.SocioNegocioUrl + '/getParticipanteByRuc/' + ruc;
        return this.http.get<any>(url);
      }
    }
    getParticipanteByRucFromERP(ruc: string): Observable<ParticipantePuntosMsg>{
      if (ruc && ruc !== '') {
        let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
        url+='/getParticipanteByRucFromERP/' + ruc;
        //const url = UrlServices.SocioNegocioUrl + '/getParticipanteByRucFromERP/' + ruc;
        return this.http.get<ParticipantePuntosMsg>(url);
      }
    }
    getVendedores(): Observable<ItemMsg[]> {
      let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
      url+='/getVendedores';
      return this.http.get<ItemMsg[]>(url);
    }
    Save(me: ParticipantePuntosMsg) {
      if (me) {
        let url= ConfigUtils.getUrlFromEndPointName('socioNegocio');
        url+='/SaveParticipante';
        //const url = UrlServices.SocioNegocioUrl + '/SaveParticipante';
        return this.http.post<SavedME>(url, me);
      }
    }
}
