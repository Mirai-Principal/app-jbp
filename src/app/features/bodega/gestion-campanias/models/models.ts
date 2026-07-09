export interface Campania {
    ID: number;
    NOMBRE: string;
    FECHA_DESDE: string;
    FECHA_HASTA: string;
    FINALIZADA: boolean;
}

export interface CampaniaDetalles {
    NRO_OF: string;
    ID_ST: number;
}

export interface UbicacionLoteMsg {
    Ubicacion: string;
    Cantidad: number;
}

export interface ST_ComponentesMsg {
    CodArticulo: string;
    Articulo: string;
    Cantidad: number;
    UnidadMedida: string;
    Lote: string;
    Ubicaciones: UbicacionLoteMsg[];
    BodegaDestino: string;
    LineNum: number;
    BodegaOrigen: string;
    CantidadReservada: number;
    RequierePicking: boolean;
}