import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { DirectorioTelefonico } from './features/directorio-telefonico/directorio-telefonico';
import { AuthGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { Dashboard } from './features/dashboard/dashboard';
import { Error } from './features/error/error';
import { UpdateNumFacturaExportacion } from './features/ventas/update-num-factura-exportacion/update-num-factura-exportacion';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'login', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio', canActivate: [AuthGuard] },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard', canActivate: [AuthGuard] },
    { path: 'actualizar-numero-factura-exportacion', component: UpdateNumFacturaExportacion, title: 'Actualizar número de factura de exportación', canActivate: [AuthGuard] },

    // Ruta para manejar páginas no encontradas
    { path: '**', component: Error }
];
