import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { DirectorioTelefonico } from './features/directorio-telefonico/directorio-telefonico';
import { AuthGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'login', component: Login, title: 'Login', canActivate: [noAuthGuard] },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio', canActivate: [AuthGuard] }
];
