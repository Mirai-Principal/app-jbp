import { Injectable, signal } from '@angular/core';
import { MenuItem } from '../models/nav-bar-menu.model';

@Injectable({ providedIn: 'root' })
export class SidebarMenuService {

    //? toca traer esto para controlar el acceso a ciertos menus
    //! vulnerable ya q se puede cambiar en el local storage, el backend deberia validar los permisos
    private readonly currentUser = localStorage.getItem('currentUser');
    private readonly ModulosAcceso = JSON.parse(this.currentUser || '{}')?.ModulosAcceso || {};


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
                {
                    name: 'Participantes Puntos',
                    icon: 'people',
                    children: [
                        { name: 'Gestionar Participante', icon: 'person', url: '/gestionar-participantes' },
                        { name: 'Notas de Crédito', icon: 'receipt_long', url: '/notas-credito' },
                        { name: 'Información de Participantes', icon: 'people', url: '/informacion-participantes' },
                    ],
                },
            ],
            visible: this.ModulosAcceso.Ventas
        },
        {
            name: 'Bodega',
            icon: 'inventory',
            children: [
                { name: 'Generar QR de Ubicaciones', icon: 'qr_code', url: '/generar-qr-ubicaciones' },
                { name: 'Gestionar Campañas Pesaje', icon: 'scale', url: '/gestion-campanias' },
            ],
            visible: this.ModulosAcceso.Bodega
        },
        {
            name: 'Farmacovigilancia',
            icon: 'local_pharmacy',
            children: [
                { name: 'Reporte de Reacciones', icon: 'radar', url: '/reacciones' },
            ],
            visible: this.ModulosAcceso.Farmacovigilancia || this.ModulosAcceso.tics
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
            name: 'Apps',
            icon: 'install_mobile',
            children: [
                { name: 'Bodega y Ventas', icon: 'warehouse', url: '/bodega-ventas-apps' },
                { name: 'Permisos, horas extras y traslados', icon: 'edit_note', url: 'https://apps.powerapps.com/play/e/default-f5c864c7-85e9-4e64-80fc-3c9d2c0f9fc3/a/b46fe945-df71-4c24-92fe-541581471e7c?tenantId=f5c864c7-85e9-4e64-80fc-3c9d2c0f9fc3&hint=526bea88-ddeb-41d5-9792-b768cf6eb9b0&sourcetime=1787691508691', external: true },
            ],
            visible: true
        }
    ]);

    getMenu() {
        return this._menu();
    }
}