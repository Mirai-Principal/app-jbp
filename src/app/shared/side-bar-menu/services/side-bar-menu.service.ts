import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/side-bar-menu.model';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {

    private readonly _menu = signal<MenuItem[]>([
        {
            name: 'Directorio',
            icon: 'contacts',
            url: '/directorio'
        },
        {
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/dashboard'
        },
        {
            name: 'Ventas',
            icon: 'point_of_sale',
            children: [
                { name: 'Actualizar Num Factura Exp', icon: 'numbers', url: '/actualizar-numero-factura-exportacion' },
                { name: 'Entregas Urbano', icon: 'local_shipping', url: '/entregas-urbano' },
                { name: 'Hoja de Ruta', icon: 'route', url: '/ventas/hoja-ruta' },
                { name: 'Participantes Puntos', icon: 'people', url: '/ventas/participantes-puntos' },
                { name: 'Facturas historicas por cliente', icon: 'fact_check', url: '/ventas/facturas-historicas-por-cliente' }
            ]
        },
        {
            name: 'Orders',
            icon: 'receipt',
            url: '/orders'
        },
        {
            name: 'Customers',
            icon: 'group',
            url: '/customers'
        },
        {
            name: 'Settings',
            icon: 'settings',
            url: '/settings'
        }
    ]);

    getMenu() {
        return this._menu();
    }
}