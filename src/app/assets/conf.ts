export const entorno: "services" | "dev" | "servicesnube" = "services";
export const backend_api = `/api-${entorno}`;
// export const service_layer = 'http://localhost:3300/api/v1/';
export const service_layer = 'http://192.168.57.1:3300/api/v1/';
export const apiKey = "1999295F480CE1A208EC264A0C9CA82D6D1899485664EAA479360D6F2566A2D1"

export const conf = {
    directorio: `/api-${entorno}/directorio`,
    promotick: `/api-${entorno}/promotick`,
    entrega: `/api-${entorno}/entrega`,
    transportista: `/api-${entorno}/transportista`,
    conf: `/api-${entorno}/conf`,
    socioNegocio: `/api-${entorno}/socioNegocio`,
    user: `/api-${entorno}/user`,
    reacciones: `/api-${entorno}/reacciones`,
    factura: `/api-${entorno}/factura`,
    facturaHistorico: `/api-${entorno}/facturahistorico`,
    bodega: `/api-${entorno}/bodega`,
    marketing: `/api-${entorno}/marketing`
}