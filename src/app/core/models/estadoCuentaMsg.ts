export class EstadoCuentaMsg{
    codigo: number;
    mensaje: string;
    data: DataMsg;
    constructor(){
        this.data=new DataMsg();
    }
}

export class DataMsg{
    acelerador: number;
    bonoSemestral1: number;
    bonoSemestral2: number;
    canjes: CanjeMsg[];
    cupoAnual:number;
    detalleEstadoCuenta: DetalleEstadoCuentaMsg[];
    montoFacturacion: number;
    participante: string;
    puntosCanjeados: number;
    puntosDisponibles: number;
    ruc: string;
    
    constructor(){
        this.canjes=[];
    }
}
export class DetalleEstadoCuentaMsg{
    mes: number;
    facturado: number;
    canjeado: number;
    descargado: number;
    acumulado: number;
    mostrar: boolean;
}

export class CanjeMsg{
    idPedido: number;
    totalPuntos: number;
    fecha: string;
    detalles: DetalleCompraMsg[];
    constructor(){
        this.detalles=[];
    }
}

export class DetalleCompraMsg{
    idProducto: number;
    cantidad: number;
    puntosUnitario: number;
}
