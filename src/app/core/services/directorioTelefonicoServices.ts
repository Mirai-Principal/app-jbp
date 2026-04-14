import {HttpClient} from '@angular/common/http';
import {Observable, observable, Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { DirectorioMsg} from '../msg/directorioMsg';
import { ConfigUtils } from '../utils/configUtils';


@Injectable()
export class DirectorioTelefonicoService{
    
    constructor(private http: HttpClient){}
        
    getDirectorio():Observable<any>{
        const url= ConfigUtils.getUrlFromEndPointName('directorio');
        return this.http.get<any>(url);
    }
}
