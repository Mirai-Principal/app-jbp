import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Promotick, ConfMsg } from '../msg/confMsg';
import { EstadoCuentaMsg, RucMsg } from '../msg/promotickMsg';
import { ConfigUtils } from '../utils/configUtils';

@Injectable()
export class BodegaServices {
    
    hojaRuta: any;
    constructor(
        private http: HttpClient
    ) {
    }
    getSubniveles():Observable<any>{
        const url=ConfigUtils.getUrlFromEndPointName('bodega')+'/getSubnivelesAlmacen';
        return this.http.get<any>(url);      
    }
    /**
     Ej. si token es 'NIVEL' -> trae los niveles
     Ej. si token es 'PERCHA' -> trae las perchas
     */
    
    getNivelesByTocken(subniveles: any[],token){
        let ms: any[]=[];
        subniveles.forEach(sb=>{
            if(sb.descripcion.indexOf(token)==0) // si contiene el token (percha, nivel, seccion)
                ms.push(sb);
        });
        return ms;
    }
    getContenidoUbicacion(ubicacion){
        const url=ConfigUtils.getUrlFromEndPointName('bodega')+'/consultaubicacion/'+ubicacion;
        console.log(url);
        return this.http.get<any>(url);      
    }
    getContenidoLote(lote, codArticulo){
        let url=ConfigUtils.getUrlFromEndPointName('bodega')+'/getUbicacionesYDetArticuloPorLote/'+lote;
        if(codArticulo)
            url+='/'+codArticulo;
        return this.http.get<any>(url);     
    }
}