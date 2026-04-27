export interface ConsultaLoteResponse {
    Error: string | null;
    Id: string | null;
    CodArticulo: string | null;
    Articulo: string | null;
    Lote: string | null;
    CodPoe: string | null;
    Estado: string | null;
    UnidadMedida: string | null;
    LoteProveedor: string | null;
    Fabricante: string | null;
    FechaIngreso: string | null;
    FechaFabricacion: string | null;
    FechaVencimiento: string | null;
    FechaRetest: string | null;
    Proveedor: string | null;
    CondicionAlmacenamiento: string | null;
    Bultos: string | null;
    Observaciones: string | null;
    CondicionAlmacenamientoPT: string | null;
    ResponsableEmpaque: string | null;
    Cliente: string | null;
    Cantidad: number;
    CodPoePT: string | null;
    UbicacionesCantidad: {
        CodBodega: string;
        Ubicacion: string;
        CantBodega: number;
        CantUbicacion: number;
    }[];
    LoteFabricante: string | null;
    CantidadPT: number;
    EsPT: boolean;
    BodegaDestino: string | null;
}