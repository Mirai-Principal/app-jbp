export interface documentosEnviadosResponse {
    descripcion: string;
    tipoDocumento: string;
    fechaEnvio: string;
    fechaDocumento: string;
    fechaDocumentoOriginal: string;
    nroDocumento: string;
    monto: number;
    puntos: number;
    codRespWS: number;
    respWs: string;
    ruc: string;
}

export interface response {
    mensaje: string
    datos: documentosEnviadosResponse[];
}