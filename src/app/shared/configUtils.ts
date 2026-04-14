import conf from '../../assets/conf';
//import conf from '../../assets/confTest';
//import conf from '../../assets/confDev';

export class ConfigUtils {
    static urlConsultaLoteArticulo:string = 'http://app.jbp.com.ec/consultaLote?lote=';
    static urlConsultaUbicacion:string = 'http://app.jbp.com.ec/consultaUbicacion?ubicacion=';
    //static urlConsultaLoteArticulo:string = 'http://apptest.jbp.com.ec/consultaLote?lote=';
    //static urlConsultaUbicacion:string = 'http://apptest.jbp.com.ec/consultaUbicacion?ubicacion=';
    static getUrlFromEndPointName(endPointName){
        let endPoints= conf.filter(c=>c.name=='urlWebServices').shift();
        if(endPoints){
            let endPoint=endPoints.value.filter(ep=>ep.endPointName==endPointName).shift();
            if(endPoint)
                return endPoint.url;
        } 
        return null;
    }
}
