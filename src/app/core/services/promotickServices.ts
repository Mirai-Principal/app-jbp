import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Promotick, ConfMsg } from '../msg/confMsg';
import { EstadoCuentaMsg, RucMsg } from '../msg/promotickMsg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class PromotickServices {
    constructor(
        private http: HttpClient
    ) {
        
    }
    getEstadoCuentaByRuc(ruc:string):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('promotick')+'/getEstadoCuenta/'+ruc;
        console.log(url);
        return this.http.get<any>(url);      
    }
    getDocumentosEnviadosByRuc(ruc:string):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('promotick')+'/getDocumentosEnviados/'+ruc;
        return this.http.get<any>(url);      
    }
    getHeaderWsPromotick(ptkConf: Promotick):any{
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Basic ' + btoa(ptkConf.User+':'+ptkConf.Pwd)
            })
          };
        return httpOptions;
    }
}