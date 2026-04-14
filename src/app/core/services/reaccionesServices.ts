import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Promotick, ConfMsg } from '../msg/confMsg';
import { EstadoCuentaMsg, RucMsg } from '../msg/promotickMsg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class ReaccionesServices {
    hojaRuta: any;
    constructor(
        private http: HttpClient
    ) {
    }
     getReacciones():Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('reacciones');
        return this.http.get<any>(url);      
    }
}