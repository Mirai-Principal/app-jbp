import { Injectable, inject, signal } from '@angular/core';
import { MenuItem } from '../models/nav-bar-menu.model';
import { UserService } from '../../../core/services/user.service';

@Injectable({ providedIn: 'root' })
export class NavbarMenuService {
    private readonly userService = inject(UserService);

    private readonly _menu = signal<MenuItem[]>([]);
    public readonly menu = this._menu.asReadonly();

    constructor() {
        this.refreshMenu();

        // Actualizar el menú automáticamente cuando cambie la sesión del usuario (login / logout)
        this.userService.currentUser.subscribe(() => {
            this.refreshMenu();
        });
    }

    public refreshMenu(): void {
        const currentUser = localStorage.getItem('currentUser');
        const modulos = JSON.parse(currentUser || '{}')?.ModulosAcceso || {};

        this._menu.set([
            {
                name: 'Directorio',
                icon: 'phone',
                url: '/directorio',
                visible: true
            },
            {
                name: 'Dashboard',
                icon: 'dashboard',
                url: '/dashboard',
                visible: modulos.Dashboards
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
                visible: modulos.Ventas
            },
            {
                name: 'Bodega',
                icon: 'inventory',
                children: [
                    { name: 'Generar QR de Ubicaciones', icon: 'qr_code', url: '/generar-qr-ubicaciones' },
                    { name: 'Gestionar Campañas Pesaje', icon: 'scale', url: '/gestion-campanias' },
                ],
                visible: modulos.Bodega
            },
            {
                name: 'Farmacovigilancia',
                icon: 'local_pharmacy',
                children: [
                    { name: 'Reporte de Reacciones', icon: 'radar', url: '/reacciones' },
                ],
                visible: modulos.FarmacoVigilancia || modulos.tics
            },
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
                    { name: 'Descargar Power Apps', icon: 'download', url: '/Power_Apps.apk', external: true, download: true },
                    { name: 'Permisos, horas extras y traslados', icon: 'edit_note', url: 'https://apps.powerapps.com/play/e/default-f5c864c7-85e9-4e64-80fc-3c9d2c0f9fc3/a/b46fe945-df71-4c24-92fe-541581471e7c?tenantId=f5c864c7-85e9-4e64-80fc-3c9d2c0f9fc3&hint=526bea88-ddeb-41d5-9792-b768cf6eb9b0&sourcetime=1787691508691', external: true },
                ],
                visible: true
            },
            {
                name: 'SAP',
                icon: 'corporate_fare',
                children: [
                    { name: 'Desbloquear Usuario', icon: 'lock', url: '/sap/desbloquear-usuario' },
                    {
                        name: 'Asuntos regulatorios',
                        icon: 'list_alt',
                        children: [
                            { name: 'Lista de materiales', icon: 'list', url: '/lista-de-materiales' },
                        ],
                        visible: modulos.tics
                    },
                ],
                visible: true
            }
        ]);
    }

    getMenu(): MenuItem[] {
        this.refreshMenu();
        return this._menu();
    }
}