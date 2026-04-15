import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UrlServices {
    // Desarrollo
    //static userUrl = 'http://jbpservices/api/user';
    //static SocioNegocioUrl = 'http://localhost:53628/api/socioNegocio';
    //static periodoUrl = 'http://jbpservices/api/periodo';
    //static cuentaUrl = 'http://jbpservices/api/cuenta';
    //static signalRUrl = 'http://localhost:5000/notify'; // esto es solo para pruebas de signalR
    //static promotickServiceHubUrl = 'http://localhost:5000/checkOrdersToPromotickBusinessService';
    // static promotickBusinessServiceOrdersUrl = 'http://localhost:5000/api/PromotickBusinessServicesOrders';
    //static promotickBusinessServiceOrdersUrl = 'http://localhost:5000/api/PromotickBusinessServicesOrders';
    // static retencionesServiceHubUrl = 'http://localhost:5000/StatusManager';
    // static retencionesServiceUrl = 'http://localhost:5000/api/Retenciones';
    //static autorizacionesSRIServiceUrl = 'http://jbpservices/api/autorizacionSRI';

    // produccion
    //static userUrl = 'http://services.jbp.com.ec/api/user';
    //static SocioNegocioUrl = 'http://services.jbp.com.ec/api/socioNegocio';
    static periodoUrl = 'http://services.jbp.com.ec/api/periodo';
    static cuentaUrl = 'http://services.jbp.com.ec/api/cuenta';
    static signalRUrl = 'http://services2.jbp.com.ec/notify'; // esto es solo para pruebas de signalR
    static promotickServiceHubUrl = 'http://services2.jbp.com.ec/checkOrdersToPromotickBusinessService';
    static promotickBusinessServiceOrdersUrl = 'http://services2.jbp.com.ec/api/PromotickBusinessServicesOrders';
    static retencionesServiceHubUrl = 'http://services2.jbp.com.ec/StatusManager';
    static retencionesServiceUrl = 'http://services2.jbp.com.ec/api/Retenciones';
    static autorizacionesSRIServiceUrl = 'http://services.jbp.com.ec/api/autorizacionSRI';

}