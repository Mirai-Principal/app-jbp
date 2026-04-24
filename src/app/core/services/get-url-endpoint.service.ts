import { Injectable } from '@angular/core';
import { conf } from '../../assets/conf';
//import conf from '../../assets/confTest';
//import conf from '../../assets/confDev';

@Injectable({
    providedIn: 'root',
})
export class GetUrlEndpointService {
    urlConsultaLoteArticulo: string = 'http://app.jbp.com.ec/consultaLote?lote=';
    urlConsultaUbicacion: string = 'http://app.jbp.com.ec/consultaUbicacion?ubicacion=';
    //static urlConsultaLoteArticulo:string = 'http://apptest.jbp.com.ec/consultaLote?lote=';
    //static urlConsultaUbicacion:string = 'http://apptest.jbp.com.ec/consultaUbicacion?ubicacion=';

    getUrlFromEndPointName(endPointName: keyof typeof conf): string | null {
        if (conf[endPointName]) {
            return conf[endPointName];
        }
        return null;
    }
}
