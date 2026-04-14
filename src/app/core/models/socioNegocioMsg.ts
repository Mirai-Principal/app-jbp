export interface SocioNegocioItem {
    Ruc: string;
    Nombre: string;
}

export interface ParticipantePuntosMsg {
    Activo: boolean;
    apellidos: string;
    celular: string;
    clave: string;
    Comentario: string;
    metaAnual: number;
    Elite: boolean;
    email: string;
    fechaNacimiento: Date;
    idCatalogo: number;
    nombres: string;
    nroDocumento: string;
    NroDocumentoAnterior: string;
    RucPrincipal: string;
    telefono: string;
    tipoDocumento: number;
    tipoGenero: number;
    vendedor: string;
}
