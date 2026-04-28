export interface Medicamento {
    idReaccion: number;
    codViaAdministracion: number;
    idQuePasoConMedicamento: number;
    quePasoConMedicamento: string;
    codMedicamento: number | null;
    lote: string;
    fechaVencimiento: string;
    cantidadFrecuencia: string;
    fechaUtilizacion: string;
    cuandoDejoUsar: string;
    haVueltoReaccion: boolean;
    paraQueUtilizo: string;
    posologia: string;
    viaAdministracion: string;
    medicamento: string;
    id: number;
}

export interface InformacionReaccion {
    idReaccion: number;
    idEstadoPersonaAfectada: number;
    estadoPersonaAfectada: string;
    fechaInicio: string;
    fechaFin: string;
    siguiioTratamiento: boolean;
    sintomas: string;
    tratamiento: string;
    id: number;
}

export interface ReaccionesReporteResponse {
    idStr: string;
    idRangoEdad: number;
    idQuienPadecioReaccion: number;
    nombres: string;
    apellidos: string;
    sexo: string;
    pesoKg: number;
    alturaCm: number;
    padeceOtraEnfermedad: boolean;
    notificador: string;
    notificadorMail: string;
    notificadorTelefono: string;
    otraEnfermedad: string;
    reacciones: any;
    fechaRegistro: string;
    medicamentos: Medicamento[];
    informacionesReaccion: InformacionReaccion[];
    id: number;
    rangoEdad: string;
    quienPadecioEnfermedad: string;
    reaccionesStr: string[];
}