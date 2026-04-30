import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/side-bar-menu.model';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {

    //? toca traer esto para controlar el acceso a ciertos menus
    //! vulnerable ya q se puede cambiar en el local storage, el backend deberia validar los permisos
    private readonly currentUser = localStorage.getItem('currentUser');
    private readonly ModulosAcceso = JSON.parse(this.currentUser || '{}').ModulosAcceso;


    private readonly _menu = signal<MenuItem[]>([
        {
            name: 'Directorio',
            icon: 'contacts',
            url: '/directorio',
            visible: true
        },
        {
            name: 'Dashboard',
            icon: 'dashboard',
            url: '/dashboard',
            visible: this.ModulosAcceso.Dashboards
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
            ],
            visible: this.ModulosAcceso.Ventas
        },
        {
            name: 'Bodega',
            icon: 'inventory',
            children: [
                { name: 'Generar QR de Ubicaciones', icon: 'qr_code', url: '/generar-qr-ubicaciones' },
            ],
            visible: this.ModulosAcceso.Bodega
        },
        {
            name: 'Farmacovigilancia',
            icon: 'local_pharmacy',
            children: [
                { name: 'Reporte de Reacciones', icon: 'radar', url: '/reacciones-reporte' },
            ],
            visible: this.ModulosAcceso.Farmacovigilancia
        },
        {
            name: 'Registrar Usuario',
            icon: 'person_add',
            url: '/registrar-usuario',
            visible: false
        }
        ,
        {
            name: 'Envio de Retenciones',
            icon: 'upload',
            url: '/envio-retenciones',
            visible: false
        },
        {
            name: 'Actualizar Monto Cuentas',
            icon: 'account_balance',
            url: '/actualizar-monto-cuentas',
            visible: false
        }
    ]);

    getMenu() {
        return this._menu();
    }
}