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
}

export interface response {
    mensaje: string
    datos: documentosEnviadosResponse[];
}