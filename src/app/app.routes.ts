import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { DirectorioTelefonico } from './features/directorio-telefonico/directorio-telefonico';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login' },
    { path: 'login', component: Login, title: 'Login' },
    { path: 'directorio', component: DirectorioTelefonico, title: 'Directorio', canActivate: [AuthGuard] }
];
