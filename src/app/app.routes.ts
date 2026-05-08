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
import { HistoricoFacturas } from './features/ventas/historico-facturas/historico-facturas';
import { GenerarQrUbicaciones } from './features/bodega/generar-qr-ubicaciones/generar-qr-ubicaciones';
import { ConsultarUbicacion } from './features/bodega/consultar-ubicacion/consultar-ubicacion';
import { ReaccionesReporte } from './features/reacciones-reporte/reacciones-reporte';
import { RegistrarUsuario } from './features/registrar-usuario/registrar-usuario';
import { EnvioRetenciones } from './features/envio-retenciones/envio-retenciones';
import { ActualizarMontoCuentas } from './features/actualizar-monto-cuentas/actualizar-monto-cuentas';
import { ConsultaLote } from './features/bodega/consulta-lote/consulta-lote';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'login', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard', canActivate: [AuthGuard] },
    { path: 'actualizar-numero-factura-exportacion', component: UpdateNumFacturaExportacion, title: 'Actualizar número de factura de exportación', canActivate: [AuthGuard] },
    { path: 'entregas-urbano', component: EntregasUrbano, title: 'Entregas Urbano', canActivate: [AuthGuard] },
    { path: 'hoja-de-ruta', component: HojaRuta, title: 'Hoja de Ruta', canActivate: [AuthGuard] },
    { path: 'participantes-puntos', component: ParticipantesPuntos, title: 'Participantes Puntos', canActivate: [AuthGuard] },
    { path: 'notas-credito', component: NotasCreditoComponent, title: 'Notas de Crédito', canActivate: [AuthGuard] },
    { path: 'historico-facturas', component: HistoricoFacturas, title: 'Histórico de Facturas', canActivate: [AuthGuard] },
    { path: 'generar-qr-ubicaciones', component: GenerarQrUbicaciones, title: 'Generar QR de Ubicaciones', canActivate: [AuthGuard] },
    { path: 'consultar-ubicacion', component: ConsultarUbicacion, title: 'Consultar Ubicación' },
    { path: 'consulta-lote/lote/:lote/codArticulo/:codArticulo', component: ConsultaLote, title: 'Consulta Lote' },
    { path: 'consulta-lote/lote/:lote', component: ConsultaLote, title: 'Consulta Lote' },
    { path: 'reacciones-reporte', component: ReaccionesReporte, title: 'Reporte de Reacciones', canActivate: [AuthGuard] },
    { path: 'registrar-usuario', component: RegistrarUsuario, title: 'Registrar Usuario', canActivate: [AuthGuard] },
    { path: 'envio-retenciones', component: EnvioRetenciones, title: 'Envio de Retenciones', canActivate: [AuthGuard] },
    { path: 'actualizar-monto-cuentas', component: ActualizarMontoCuentas, title: 'Actualizar Monto Cuentas', canActivate: [AuthGuard] },

    // Ruta para manejar páginas no encontradas
    { path: '**', component: Error }
];
