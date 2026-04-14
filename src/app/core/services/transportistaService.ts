import { Injectable } from '@angular/core';
import {SocioNegocioItem, ParticipantePuntosMsg} from '../msg/socioNegocioMsg';
import { UrlServices } from '../global';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { SavedME } from '../msg/common.msg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class TransportistaService{
    constructor(private http: HttpClient){}
    getTransportistas(): Observable<string[]> {
      const url=ConfigUtils.getUrlFromEndPointName('transportista');
      return this.http.get<any>(url);
    }
    
}
