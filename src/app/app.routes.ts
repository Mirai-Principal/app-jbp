import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { DirectorioTelefonico } from './features/directorio-telefonico/directorio-telefonico';
import { AuthGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { Dashboard } from './features/dashboard/dashboard';
import { Error } from './features/error/error';
import { UpdateNumFacturaExportacion } from './features/ventas/update-num-factura-exportacion/update-num-factura-exportacion';
import { EntregasUrbano } from './features/ventas/entregas-urbano/entregas-urbano';
import { HojaRuta } from './features/ventas/hoja-ruta/hoja-ruta';
import { ParticipantesPuntos } from './features/ventas/participantes-puntos/participantes-puntos';
import { NotasCreditoComponent } from './features/ventas/notas-credito/notas-credito';
import { GenerarQrUbicaciones } from './features/bodega/generar-qr-ubicaciones/generar-qr-ubicaciones';
import { ConsultarUbicacion } from './features/bodega/consultar-ubicacion/consultar-ubicacion';
import { ReaccionesReporte } from './features/reacciones-reporte/reacciones-reporte';
import { RegistrarUsuario } from './features/registrar-usuario/registrar-usuario';
import { EnvioRetenciones } from './features/envio-retenciones/envio-retenciones';
import { ConsultaLote } from './features/bodega/consulta-lote/consulta-lote';
import { GestionarParticipantes } from './features/ventas/gestionar-participantes/gestionar-participantes';
import { GenerarPesajeCampania } from './features/bodega/gestion-campanias/components/generar-pesaje-campania/generar-pesaje-campania';
import { GestionCampanias } from './features/bodega/gestion-campanias/gestion-campanias';
import { Unauthorized } from './features/unauthorized/unauthorized';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'login', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard', canActivate: [AuthGuard] },
    { path: 'actualizar-numero-factura-exportacion', component: UpdateNumFacturaExportacion, title: 'Actualizar número de factura de exportación', canActivate: [AuthGuard] },
    { path: 'entregas-urbano', component: EntregasUrbano, title: 'Entregas Urbano', canActivate: [AuthGuard] },
    { path: 'hoja-de-ruta', component: HojaRuta, title: 'Hoja de Ruta', canActivate: [AuthGuard] },
    { path: 'informacion-participantes', component: ParticipantesPuntos, title: 'Información de Participantes Puntos', canActivate: [AuthGuard] },
    { path: 'gestionar-participantes', component: GestionarParticipantes, title: 'Gestionar Participantes', canActivate: [AuthGuard] },
    { path: 'notas-credito', component: NotasCreditoComponent, title: 'Notas de Crédito', canActivate: [AuthGuard] },
    { path: 'generar-qr-ubicaciones', component: GenerarQrUbicaciones, title: 'Generar QR de Ubicaciones', canActivate: [AuthGuard] },
    { path: 'consultaUbicacion', component: ConsultarUbicacion, title: 'Consultar Ubicación' },
    { path: 'consultaLote', component: ConsultaLote, title: 'Consulta Lote' },
    { path: 'reacciones-reporte', component: ReaccionesReporte, title: 'Reporte de Reacciones', canActivate: [AuthGuard] },
    { path: 'registrar-usuario', component: RegistrarUsuario, title: 'Registrar Usuario', canActivate: [AuthGuard] },
    { path: 'envio-retenciones', component: EnvioRetenciones, title: 'Envio de Retenciones', canActivate: [AuthGuard] },
    { path: 'generar-pesaje-campania', component: GenerarPesajeCampania, title: 'Generar Pesaje Campaña', canActivate: [AuthGuard] },
    { path: 'gestion-campanias', component: GestionCampanias, title: 'Gestión de Campañas', canActivate: [AuthGuard] },
    { path: 'unauthorized', component: Unauthorized, title: 'No Autorizado', canActivate: [AuthGuard] },

    // Ruta para manejar páginas no encontradas
    { path: '**', component: Error }
];
