export const enviroment = {
    empresaNombre: 'James Brown Pharma',
    empresaIniciales: 'JBP'
};

// Desarrollo
export const UrlServicesDevelopment = {
    userUrl: 'http://jbpservices/api/user',
    SocioNegocioUrl: 'http://localhost:53628/api/socioNegocio',
    periodoUrl: 'http://jbpservices/api/periodo',
    cuentaUrl: 'http://jbpservices/api/cuenta',
    signalRUrl: 'http://localhost:5000/notify', // esto es solo para pruebas de signalR
    promotickServiceHubUrl: 'http://localhost:5000/checkOrdersToPromotickBusinessService',
    promotickBusinessServiceOrdersUrl: 'http://localhost:5000/api/PromotickBusinessServicesOrders',
    retencionesServiceHubUrl: 'http://localhost:5000/StatusManager',
    retencionesServiceUrl: 'http://localhost:5000/api/Retenciones',
    autorizacionesSRIServiceUrl: 'http://jbpservices/api/autorizacionSRI',
}

// produccion
export const UrlServicesProduction = {
    userUrl: 'http://services.jbp.com.ec/api/user',
    SocioNegocioUrl: 'http://services.jbp.com.ec/api/socioNegocio',
    periodoUrl: 'http://services.jbp.com.ec/api/periodo',
    cuentaUrl: 'http://services.jbp.com.ec/api/cuenta',
    signalRUrl: 'http://services2.jbp.com.ec/notify', // esto es solo para pruebas de signalR
    promotickServiceHubUrl: 'http://services2.jbp.com.ec/checkOrdersToPromotickBusinessService',
    promotickBusinessServiceOrdersUrl: 'http://services2.jbp.com.ec/api/PromotickBusinessServicesOrders',
    retencionesServiceHubUrl: 'http://services2.jbp.com.ec/StatusManager',
    retencionesServiceUrl: 'http://services2.jbp.com.ec/api/Retenciones',
    autorizacionesSRIServiceUrl: 'http://services.jbp.com.ec/api/autorizacionSRI',
}