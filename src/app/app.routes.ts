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
import { NotasCreditoComponent } from './features/ventas/notas-credito/notas-credito';
import { HistoricoFacturas } from './features/ventas/historico-facturas/historico-facturas';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'login', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard', canActivate: [AuthGuard] },
    { path: 'actualizar-numero-factura-exportacion', component: UpdateNumFacturaExportacion, title: 'Actualizar número de factura de exportación', canActivate: [AuthGuard] },
    { path: 'entregas-urbano', component: EntregasUrbano, title: 'Entregas Urbano', canActivate: [AuthGuard] },
    { path: 'hoja-de-ruta', component: HojaRuta, title: 'Hoja de Ruta', canActivate: [AuthGuard] },
    { path: 'participantes-puntos', component: NotasCreditoComponent, title: 'Participantes Puntos', canActivate: [AuthGuard] },
    { path: 'historico-facturas', component: HistoricoFacturas, title: 'Histórico de Facturas', canActivate: [AuthGuard] },

    // Ruta para manejar páginas no encontradas
    { path: '**', component: Error }
];
