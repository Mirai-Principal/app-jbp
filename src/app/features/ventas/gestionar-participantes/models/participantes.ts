interface documento {
    fechaDocumento: string,
    mesDocumento: string,
    numDocumento: string,
    ruc: string,
    rucPrincipal: string,
    monto: string,
    puntos: string,
    tipoDocumento: string
}

export interface Participante {
    existeEnPromotick: boolean,
    sincronizado: boolean,
    revisado: boolean,
    Activo: boolean,
    apellidos: string,
    celular: string,
    clave: string,
    Comentario: {},
    Elite: boolean,
    email: string,
    estado: number,
    nombreComercial: string,
    documentos: documento[],
    usuarioVendedor: string,
    fechaNacimiento: string,
    idCatalogo: number,
    metaAnual: number,
    nombres: string,
    nroDocumento: string,
    NroDocumentoAnterior: string,
    RucPrincipal: string,
    telefono: string,
    tipoCatalogo: number,
    tipoDocumento: number,
    tipoGenero: number,
    vendedor: string,
    Error: string,
    vendedorStr: string,
    correoVendedor: string,
    idVendedor: string
}

/**
 * esquema de datos de un particiapnte promotick
 * @param codigo codigo de la respuesta (1 = exitoso, -110 = no existe participante)
 * @param mensaje mensaje de la respuesta
 * @param data datos de la respuesta
 */
export interface EstadoCuenta {
    codigo: number,
    mensaje: string,
    data: dataEstadoCuenta
}

export interface dataEstadoCuenta {
    participante: string,
    ruc: string,
    puntosCanjeados: number,
    puntosDisponibles: number,
    cupoAnual: number,
    bonoSemestral1: number,
    bonoSemestral2: number,
    acelerador: number,
    detalleEstadoCuenta: any,
    montoFacturacion: number,
    canjes: any
}