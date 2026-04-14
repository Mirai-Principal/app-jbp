export interface ProductItem {
    Id: number;
    Nombre: string;
    Precio: number;
}
export class DetallePedido {
    IdProductoPrecio: number;
    Nombre: string;
    Cantidad: number;
    Subtotal: number;
    ValorUnitario: number;
    constructor(id: number, nombre: string, vu: number) {
        this.IdProductoPrecio = id;
        this.Nombre = nombre;
        this.ValorUnitario = vu;
        this.Cantidad = 0;
        this.Subtotal = 0;
    }
}
export class TotalPedido {
    IdPersona: number;
    IdPersonaEmpresa: number;
    FechaPedido: Date;
    FechaEntrega: Date;
    Total: number;
    Pedidos: DetallePedido[];
    constructor() {
        this.Total = 0;
        this.Pedidos = [];
    }
}
