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
    revisado: boolean;
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
