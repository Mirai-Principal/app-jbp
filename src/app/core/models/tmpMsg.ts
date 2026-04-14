export class cheque{
    public fechaVencimiento: string;
    monto: number;
    montoAsignado: number;
    montoDisponible: number;
    constructor(fechaVencimiento, monto){
        this.fechaVencimiento=fechaVencimiento;
        this.monto=monto;
        this.montoAsignado=0;
        this.calcularDisponible();
    }
    calcularDisponible(){
        this.montoDisponible= this.monto - this.montoAsignado
    }
}
export class factura{
    pago: number;
    fechaPago: string;
    montoAsignado: number;
    saldo: number;
    constructor(pago){
        this.pago=pago;
        this.montoAsignado=0;
        this.calcSaldo();
    }
    calcSaldo(){
        this.saldo=this.pago-this.montoAsignado;
    }
}