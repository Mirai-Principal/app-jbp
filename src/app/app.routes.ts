import { Routes } from '@angular/router';
import { Login } from './features/login/login';

export const routes: Routes = [
    { path: '', component: Login, title: 'Login' },
    { path: 'login', component: Login, title: 'Login' }
];
