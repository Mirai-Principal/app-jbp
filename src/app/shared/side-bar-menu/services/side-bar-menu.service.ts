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
                { name: 'Hoja de Ruta', icon: 'route', url: '/hoja-de-ruta' },
                { name: 'Participantes Puntos', icon: 'people', url: '/participantes-puntos' },
                { name: 'Histórico de Facturas', icon: 'receipt', url: '/historico-facturas' }
            ]
        },
        {
            name: 'Bodega',
            icon: 'inventory',
            children: [
                { name: 'Generar QR de Ubicaciones', icon: 'qr_code', url: '/generar-qr-ubicaciones' },
            ]
        },
        {
            name: 'Farmacovigilancia',
            icon: 'group',
            children: [
                { name: 'Reporte de Reacciones', icon: 'qr_code', url: '/reacciones-reporte' },
            ]
        },
        {
            name: 'Registrar Usuario',
            icon: 'person_add',
            url: '/registrar-usuario'
        }
        ,
        {
            name: 'Envio de Retenciones',
            icon: 'upload',
            url: '/envio-retenciones'
        }
    ]);

    getMenu() {
        return this._menu();
    }
}