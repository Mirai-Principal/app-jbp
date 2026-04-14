import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Promotick, ConfMsg } from '../msg/confMsg';
import { EstadoCuentaMsg, RucMsg } from '../msg/promotickMsg';
import { ConfigUtils } from '../utils/configUtils';
import { BaseService } from './baseService';

@Injectable()
export class MarketingServices{
    
    hojaRuta: any;
    constructor(
        private http: HttpClient
    ) {
    }
    getDasboards():Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('marketing')+'/getDasboards';
        return this.http.get<any>(url);      
    }
    deleteDasboard(id):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('marketing')+'/deleteDasboard/'+id;
        return this.http.get<any>(url);      
    }
    registrarDashBoard(dash):Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('marketing')+'/saveDashboard';
        return this.http.post<any>(url,dash);
    }
    
}