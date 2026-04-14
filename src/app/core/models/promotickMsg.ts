export interface EstadoCuentaMsg {
    participante: string;
    ruc: string;
    puntosCanjeados: number;
    puntosDisponibles: number;
}

export class RucMsg{
    numDocumento: string;
}