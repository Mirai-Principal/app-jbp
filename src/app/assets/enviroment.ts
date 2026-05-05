export const enviroment = {
    empresaNombre: 'James Brown Pharma',
    empresaIniciales: 'JBP'
};

//? dejo esto xq algunos tiene un dominio diferente
// Desarrollo
// export const UrlServicesDevelopment = {
//     userUrl: 'http://jbpservices/api/user',
//     SocioNegocioUrl: 'http://localhost:53628/api/socioNegocio',
//     periodoUrl: 'http://jbpservices/api/periodo',
//     cuentaUrl: 'http://jbpservices/api/cuenta',
//     signalRUrl: 'http://localhost:5000/notify', // esto es solo para pruebas de signalR
//     promotickServiceHubUrl: 'http://localhost:5000/checkOrdersToPromotickBusinessService',
//     promotickBusinessServiceOrdersUrl: 'http://localhost:5000/api/PromotickBusinessServicesOrders',
//     retencionesServiceHubUrl: 'http://localhost:5000/StatusManager',
//     retencionesServiceUrl: 'http://localhost:5000/api/Retenciones',
//     autorizacionesSRIServiceUrl: 'http://jbpservices/api/autorizacionSRI',
// }

// produccion
const entorno: "services" | "localhost:5000" = "services";
export const UrlServices = {
    userUrl: `http://${entorno}.jbp.com.ec/api/user`,
    SocioNegocioUrl: `http://${entorno}.jbp.com.ec/api/socioNegocio`,
    periodoUrl: `http://${entorno}.jbp.com.ec/api/periodo`,
    cuentaUrl: `http://${entorno}.jbp.com.ec/api/cuenta`,
    autorizacionesSRIServiceUrl: `http://${entorno}.jbp.com.ec/api/autorizacionSRI`,
}

const entorno2: "services2" | "localhost:5000" = "services2";
export const UrlServices2 = {
    signalRUrl: `http://${entorno2}.jbp.com.ec/notify`, // esto es solo para pruebas de signalR
    promotickServiceHubUrl: `http://${entorno2}.jbp.com.ec/checkOrdersToPromotickBusinessService`,
    promotickBusinessServiceOrdersUrl: `http://${entorno2}.jbp.com.ec/api/PromotickBusinessServicesOrders`,
    retencionesServiceHubUrl: `http://${entorno2}.jbp.com.ec/StatusManager`,
    retencionesServiceUrl: `http://${entorno2}.jbp.com.ec/api/Retenciones`,
}