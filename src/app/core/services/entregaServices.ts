import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Promotick, ConfMsg } from '../msg/confMsg';
import { EstadoCuentaMsg, RucMsg } from '../msg/promotickMsg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class EntregaServices {
    hojaRuta: any;
    constructor(
        private http: HttpClient
    ) {
        
    }
    getEntregasUrbano(entregaMe):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('entrega')+'/'+'urbano';
        //console.log(url);
        return this.http.post<any>(url,entregaMe);      
    }
    getHojaRuta(hojaRutaMe):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('entrega')+'/'+'hojaRuta';
        return this.http.post<any>(url,hojaRutaMe);      
    }
    getNumHojaRuta():Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('conf')+'/'+'getNumHojaRuta';
        return this.http.get<any>(url);      
    }
}